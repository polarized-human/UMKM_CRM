"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/cashier/Sidebar";
import Dashboard from "@/components/cashier/Dashboard";
import MemberList from "@/components/cashier/MemberList";
import MemberDetail from "@/components/cashier/MemberDetail";
import RewardsCatalog from "@/components/cashier/RewardsCatalog";
import TransactionModal from "@/components/cashier/TransactionModal";
import AddMember from "@/components/cashier/AddMember";
import QRModal from "@/components/cashier/QRModal";
import Toast from "@/components/ui/Toast";

import { Member } from "@/data/members"; 
import { useMembers } from "@/hooks/useMembers";
import "@/css/cashier/style.css"; 
import { AlertCircle, CheckCircle } from "lucide-react";

export type ActiveView = "dashboard" | "members" | "member-detail" | "rewards" | "add-member";

export default function CashierPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  
  // State untuk menyimpan data user yang login
  const [user, setUser] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);

  const {
    members,
    selectedMember, setSelectedMember,
    showTransaction, setShowTransaction,
    transactionMember, setTransactionMember, fetchMembers, prefillMemberId, setPrefillMemberId, receiptData, setReceiptData,
    handleAddTransaction, handleAddMember, handleDeleteMember, handleRedeemReward, toast, hideToast, handleSendWA, handleFraudReset
  } = useMembers();

  // CEK TOKEN & AMBIL DATA USER SAAT HALAMAN DIMUAT
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("auth_token");
      
      // Jika tidak ada token, tendang kembali ke halaman login
      if (!token) {
        setIsLoadingAuth(false); // Memastikan layar loading mati jika token tidak ada
        router.push("/auth/login");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "true"
          }
        });

        if (!response.ok) {
          throw new Error("Sesi tidak valid");
        }

        // Pengecekan agar tidak error jika server membalas dengan HTML
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const userData = await response.json();
          setUser(userData); 
        } else {
          throw new Error("Gagal membaca sesi: Format data tidak sesuai.");
        }

      } catch (error) {
        console.error("Gagal memuat sesi:", error);
        localStorage.removeItem("auth_token");
        router.push("/auth/login");
      } finally {
        setIsLoadingAuth(false);
      }
    };

    fetchUser();
  }, [router]);

  // FUNGSI LOGOUT
  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        // Beritahu Laravel untuk menghapus token di database
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          }
        });
      } catch (e) {
        console.error("Gagal logout di server", e);
      }
    }
    
    // Hapus token di browser & tendang ke login
    localStorage.removeItem("auth_token");
    router.push("/auth/login");
  };

  const openTransaction = (member: Member) => {
    setTransactionMember(member);
    setShowTransaction(true);
  };

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    setActiveView("member-detail");
  };

  // Tampilkan layar loading hitam selama mengecek token
  if (isLoadingAuth) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0f", color: "#fbbf24" }}>
        <div style={{ width: "50px", height: "50px", border: "4px solid rgba(251, 191, 36, 0.2)", borderTop: "4px solid #fbbf24", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "1rem" }} />
        <p style={{ fontWeight: 600, letterSpacing: "1px" }}>Menyiapkan Sistem Kasir...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="kasir-layout">
      {/* Pass user dan onLogout ke Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} user={user} onLogout={handleLogout} />

      {/* Bagian utama yang berubah sesuai activeView/Dashboard */}
      <main className="main-content">
        {activeView === "dashboard" && (
          <Dashboard members={members} onSelectMember={handleSelectMember} onOpenTransaction={openTransaction} user={user} />
        )}

        {/* Halaman list member */}
        {activeView === "members" && (
          <MemberList 
            members={members} 
            onSelectMember={handleSelectMember} 
            onOpenTransaction={openTransaction} 
            onAddMember={() => setActiveView("add-member")}
            onShowQR={() => setShowQRModal(true)}
            onRefresh={fetchMembers} // <--- Tambahan
            onGoToRewards={(id) => { 
              setPrefillMemberId(id); // <--- Simpan ID
              setActiveView("rewards"); 
            }}
            onSendWA={handleSendWA}
          />
        )}

        {/* Halaman tambah member */}
        {activeView === "add-member" && (
          <AddMember 
            onBack={() => setActiveView("members")} 
            onSave={(newMember) => {
              handleAddMember(newMember);
              setActiveView("members");
            }} 
          />
        )} 

        {/* Detail member hanya tampil jika ada member yang dipilih */}
        {activeView === "member-detail" && selectedMember && (
          <MemberDetail member={selectedMember} 
          onBack={() => setActiveView("members")} 
          onOpenTransaction={openTransaction}
          onResetPoints={handleFraudReset}
          onDelete={async (id) => {
              const success = await handleDeleteMember(id);
              if (success) {
                setActiveView("members"); // Kembali ke list member jika sukses dihapus
              }
            }} />
        )}

        {/* Katalog */}
        {activeView === "rewards" && (
          <RewardsCatalog 
            members={members} 
            prefillMemberId={prefillMemberId} // <--- Lempar ID
            onClearPrefill={() => setPrefillMemberId(null)} // <--- Bersihkan ID
            onRedeem={handleRedeemReward} 
          />
        )}
      </main>

      {/* MODAL QR CODE */}
      <QRModal 
        isOpen={showQRModal} 
        onClose={() => setShowQRModal(false)} 
        storeId={user ? user.id : "demo-store"} 
      />

      {/* MODAL TRANSAKSI */}
      {showTransaction && transactionMember && (
        <TransactionModal
          member={transactionMember}
          onClose={() => { setShowTransaction(false); setTransactionMember(null); }}
          onConfirm={handleAddTransaction}
        />
      )}

      {/* --- TOAST NOTIFICATION --- */}
      <Toast 
        isVisible={toast.isOpen} 
        type={toast.type === "danger" ? "error" : "success"} 
        message={toast.message} 
        onClose={hideToast}
      />

      {/* MODAL CETAK STRUK TRANSAKSI */}
      {receiptData && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ background: "#fff", color: "#000", maxWidth: "350px", textAlign: "center", fontFamily: "monospace" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", borderBottom: "1px dashed #000", paddingBottom: "0.5rem", marginBottom: "1rem" }}>TOKO DEMO</h2>
            <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>{receiptData.date}</p>
            <p style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>Pelanggan: {receiptData.member.name}</p>
            <div style={{ borderBottom: "1px dashed #000", paddingBottom: "0.5rem", marginBottom: "1rem", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Total Belanja:</span>
                <strong>Rp{receiptData.amount.toLocaleString("id-ID")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                <span>Poin Didapat:</span>
                <strong>+{receiptData.amount * 0.1} pts</strong> {/* Asumsi 10% */}
              </div>
            </div>
            <div style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
              TOTAL POIN: {receiptData.points} pts
            </div>
            <div className="modal-actions" style={{ justifyContent: "center" }}>
              <button onClick={() => setReceiptData(null)} style={{ padding: "0.5rem 1rem", border: "1px solid #ccc", background: "#f3f4f6", borderRadius: "0.25rem", cursor: "pointer" }}>Tutup</button>
              <button onClick={() => window.print()} style={{ padding: "0.5rem 1rem", border: "none", background: "#10b981", color: "white", borderRadius: "0.25rem", cursor: "pointer", fontWeight: "bold" }}>Cetak Struk</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}