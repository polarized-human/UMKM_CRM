import { useState, useEffect } from "react";
import { Member, members as initialMembers } from "@/data/members";

export type ActiveView = "dashboard" | "members" | "member-detail" | "add-member" | "rewards" | string;

export function useMembers() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showTransaction, setShowTransaction] = useState(false);
  const [transactionMember, setTransactionMember] = useState<Member | null>(null);
  const [prefillMemberId, setPrefillMemberId] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<{ member: Member, amount: number, points: number, date: string } | null>(null);

  const [toast, setToast] = useState<{isOpen: boolean, type: "success" | "danger", title: string, message: string}>({
    isOpen: false,
    type: "success",
    title: "",
    message: ""
  });

  const showToast = (type: "success" | "danger", title: string, message: string) => {
    setToast({ isOpen: true, type, title, message });

    // Otomatis sembunyikan toast setelah 3 detik
    setTimeout(() => {
      setToast(prev => ({ ...prev, isOpen: false }));
    }, 3000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isOpen: false }));
  };

  // 1. BUAT FUNGSINYA TERLEBIH DAHULU DI SINI
  const fetchMembers = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "true" 
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        const formattedMembers = data.map((item: any) => ({
          id: item.member_id, 
          name: item.name,
          phone: item.phone,
          email: item.email || "",
          birthDate: item.birth_date || "",
          points: item.points,
          tier: item.tier,
          totalSpend: parseFloat(item.total_spend),
          joinDate: item.created_at,
          lastVisit: item.last_visit,
          avatar: item.name.substring(0, 2).toUpperCase(),
          transactions: item.transactions ? item.transactions.map((trx: any) => ({
            id: trx.transaction_code,
            date: trx.created_at,
            amount: parseFloat(trx.amount),
            points: trx.points,
            type: trx.type,
            description: trx.description
          })) : []
        }));
        
        setMembers(formattedMembers);
      }
    } catch (error) {
      console.error("Gagal mengambil data member:", error);
    }
  };

  // 2. BARU BOLEH DIPANGGIL DI SINI OLEH useEffect
  useEffect(() => {
    fetchMembers();
  }, []); 

  // =========================================================
  // FUNGSI LAINNYA (handleAddMember dll) TETAP DI BAWAH SINI
  // =========================================================
  const handleAddMember = async (newMember: Member) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      // PERBAIKAN 1
      showToast("danger", "Sesi Habis", "Sesi telah habis, silakan login ulang.");
      return;
    }

    try {
      // 1. Tembak API Backend
      // Kirim null (bukan string kosong) untuk field opsional yang tidak diisi,
      // supaya tidak dianggap "duplikat" oleh validasi unique di backend.
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: newMember.name,
          phone: newMember.phone,
          email: newMember.email && newMember.email.trim() !== "" ? newMember.email.trim() : null,
          birth_date: newMember.birthDate && newMember.birthDate.trim() !== "" ? newMember.birthDate : null
        })
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        // Kumpulkan semua pesan error validasi dari backend (format Laravel: { errors: { field: [pesan] } })
        const errorMessages: string[] = result?.errors
          ? (Object.values(result.errors).flat() as string[])
          : [];
        const combinedMessage = errorMessages.join(" ") || result?.message || "";

        if (/email/i.test(combinedMessage) && /taken|sudah|terdaftar|unique/i.test(combinedMessage)) {
          showToast("danger", "Email Sudah Terdaftar", "Email tersebut sudah digunakan oleh member lain. Gunakan email lain atau kosongkan saja.");
        } else if (/phone|hp|nomor/i.test(combinedMessage) && /taken|sudah|terdaftar|unique/i.test(combinedMessage)) {
          showToast("danger", "Nomor HP Sudah Terdaftar", "Nomor WhatsApp tersebut sudah digunakan oleh member lain.");
        } else {
          showToast("danger", "Gagal Menyimpan", combinedMessage || "Gagal menyimpan data ke server.");
        }
        return;
      }

      // 2. Ambil data balasan dari server
      const dbCustomer = result.data;

      // 3. Format kembali agar cocok dengan UI React
      const formattedNewMember: Member = {
        id: dbCustomer.member_id,
        name: dbCustomer.name,
        phone: dbCustomer.phone,
        email: dbCustomer.email || "",
        birthDate: dbCustomer.birth_date || "",
        points: dbCustomer.points,
        tier: dbCustomer.tier,
        totalSpend: parseFloat(dbCustomer.total_spend),
        joinDate: dbCustomer.created_at,
        lastVisit: dbCustomer.last_visit,
        avatar: dbCustomer.name.substring(0, 2).toUpperCase(),
        transactions: []
      };

      // 4. Update state tampilan tanpa perlu refresh halaman
      setMembers((prev) => [formattedNewMember, ...prev]);
      
      // PERBAIKAN 2
      showToast("success", "Berhasil", `Member ${formattedNewMember.name} berhasil ditambahkan!`);

    } catch (error) {
      console.error(error);
      
      // PERBAIKAN 3
      showToast("danger", "Gagal", "Terjadi kesalahan saat mendaftarkan member.");
    }
  };

  // 3. Tambah Transaksi (UPDATE)
  const handleAddTransaction = async (memberId: string, amount: number, points: number) => {
    const token = localStorage.getItem("auth_token");
    if (!token) return showToast("danger", "Sesi Habis", "Silakan login ulang");

    try {
      // 1. Kirim data ke Laravel
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${memberId}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({ amount, points })
      });

      if (!response.ok) throw new Error("Gagal menyimpan transaksi");

      
      // 2. Ambil data customer yang sudah di-update beserta riwayat transaksinya dari server
      const result = await response.json();
      const dbCustomer = result.customer;

      let updatedMemberData: Member | null = null; // <--- Buat penampung sementara

      setMembers((prev) => prev.map((m) => {
        if (m.id === memberId) {
          const updated = {
            ...m,
            points: dbCustomer.points,
            totalSpend: parseFloat(dbCustomer.total_spend),
            tier: dbCustomer.tier,
            lastVisit: dbCustomer.last_visit,
            transactions: dbCustomer.transactions.map((trx: any) => ({
              id: trx.transaction_code,
              date: trx.created_at,
              amount: parseFloat(trx.amount),
              points: trx.points,
              type: trx.type,
              description: trx.description
            }))
          };
          
          updatedMemberData = updated; // <--- Simpan data ke penampung

          // Jika detail member ini sedang dibuka, update juga tampilannya
          if (selectedMember?.id === memberId) setSelectedMember(updated);
          return updated;
        }
        return m;
      }));

      setShowTransaction(false);
      setTransactionMember(null);
      
      // Gunakan penampung tadi untuk mencetak struk
      if (updatedMemberData) {
        setReceiptData({ 
          member: updatedMemberData, 
          amount, 
          points: dbCustomer.points, 
          date: new Date().toLocaleString("id-ID") 
        });
      }
      
      showToast("success", "Berhasil", "Transaksi berhasil dicatat!");

    } catch (error) {
      console.error(error);
      showToast("danger", "Gagal", "Gagal menyimpan transaksi ke server.");
    }
  };

  // 4. Redeem Poin
  // --- TAMBAHKAN FUNGSI INI DI DALAM useMembers ---
  const handleRedeemReward = async (memberId: string, rewardName: string, pointsNeeded: number) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${memberId}/redeem`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "true"
        },
        body: JSON.stringify({ 
          reward_name: rewardName, 
          points_needed: pointsNeeded 
        })
      });

      const data = await response.json();

      // Jika poin tidak cukup atau ada error dari Laravel
      if (!response.ok) {
        showToast("danger", "Gagal", data.message || "Gagal menukar poin.");
        return false;
      }

      // Update state UI React agar poin otomatis berkurang tanpa perlu refresh halaman
      setMembers((prevMembers) =>
        prevMembers.map((m) => 
          (m.id === memberId || (m as any).member_id === memberId) 
            // --- UPDATE: Gabungkan data lama (...m) dengan data baru (...data.customer) ---
            ? { ...m, ...data.customer } 
            : m
        )
      );
      showToast("success", "Berhasil", `Berhasil menukar ${rewardName}!`);
      return true;
      
    } catch (error) {
      console.error("Redeem error:", error);
      showToast("danger", "Gagal", "Terjadi kesalahan jaringan saat menukar poin.");
      return false;
    }
  };

  // 5. Reset Akun Total (Penalti Kecurangan)
  const handleFraudReset = async (memberId: string) => {
    const currentMember = members.find((m) => m.id === memberId);
    if (!currentMember) return;

    // Reset semuanya sekaligus
    const updatedMember: Member = {
      ...currentMember,
      points: 0,
      totalSpend: 0,
      tier: "Bronze", 
      transactions: [
        {
          id: `PNL-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          amount: 0,
          points: -currentMember.points, // Catat jumlah poin yang hangus
          type: "redeem" as const,
          description: "PENALTI KECURANGAN: Poin dan Total Belanja dihanguskan",
        },
        ...(currentMember.transactions || []),
      ],
    };

    try {
      // 1. Ambil token dari local storage
      const token = localStorage.getItem("auth_token");
      if (!token) {
        showToast("danger", "Sesi Habis", "Silakan login ulang untuk melakukan aksi ini.");
        return;
      }

      // 2. PERBAIKAN: Ubah /members/ jadi /customers/ dan tambahkan header Authorization
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${memberId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true" 
        },
        body: JSON.stringify({
          points: updatedMember.points,
          total_spend: updatedMember.totalSpend, // Sesuaikan dengan nama kolom di database (total_spend)
          tier: updatedMember.tier,
          last_visit: updatedMember.lastVisit // Sesuaikan dengan nama kolom di database (last_visit)
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Gagal update backend.");
      }

      setMembers((prev) => prev.map((m) => (m.id === memberId ? updatedMember : m)));
      setSelectedMember(updatedMember);
      showToast("success", "Berhasil Reset Akun", `Poin & Belanja ${currentMember.name} telah di-reset menjadi 0.`);    
    } catch (error: any) {
      console.error(error);
      showToast("danger", "Gagal!", error.message || "Gagal melakukan reset penalti. Cek koneksi backend.");
    }
  };

  // Fungsi Delete Member
  const handleDeleteMember = async (memberId: string) => {
    // 1. Munculkan peringatan agar tidak tidak sengaja terhapus

    try {
      const token = localStorage.getItem("auth_token");
      
      // 2. Tembak API Laravel dengan metode DELETE
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${memberId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "ngrok-skip-browser-warning": "true"
        }
      });

      if (!response.ok) throw new Error("Gagal menghapus member");

      // 3. Update state React: Buang member yang dihapus dari daftar agar UI langsung update tanpa loading ulang
      setMembers((prevMembers) => prevMembers.filter(m => m.id !== memberId));

      showToast("success", "Berhasil Menghapus Member", `Member telah berhasil dihapus.`);
      
      // 4. Kembali ke halaman utama/dashboard setelah menghapus
      return true; // Beri sinyal bahwa hapus sukses
      
    } catch (error) {
      console.error(error);
      showToast("danger", "Gagal", "Terjadi kesalahan saat menghapus member.");
      return false; // Beri sinyal bahwa hapus gagal
    }
  };

  const handleSendWA = async (phone: string, name: string) => {
    // Di sini nantinya Anda bisa menembak endpoint Laravel sungguhan
    showToast("success", "Pesan WA Terkirim", `Notifikasi poin berhasil dikirim ke ${phone} (${name})`);
  };

  // Kembalikan semua fungsi agar bisa dipakai di UI
  return {
    activeView, setActiveView,
    members, handleSendWA,
    selectedMember, setSelectedMember,
    showTransaction, setShowTransaction,
    transactionMember, setTransactionMember,
    prefillMemberId, setPrefillMemberId,
    receiptData, setReceiptData,
    fetchMembers,
    handleAddMember, handleAddTransaction, handleRedeemReward, handleFraudReset, handleDeleteMember, toast, hideToast
  };
}