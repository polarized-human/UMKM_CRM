"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- Komponen & Data ---
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

// --- Styles ---
import "@/css/cashier/style.css";
import "@/css/cashier/components.css";
import "@/css/cashier/animations.css";

export type ActiveView = "dashboard" | "members" | "member-detail" | "rewards" | "add-member";

export default function CashierPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
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

  const baseUrl = '/api';

  // CEK TOKEN & AMBIL DATA USER SAAT HALAMAN DIMUAT
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        setIsLoadingAuth(false);
        router.push("/auth/login");
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/user`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "ngrok-skip-browser-warning": "true"
          }
        });

        if (!response.ok) throw new Error("Sesi tidak valid");

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
        await fetch(`${baseUrl}/logout`, {
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

  // --- RENDER LAYAR LOADING ---
if (isLoadingAuth) {
    return (
      <div className="kasir-layout" style={{ justifyContent: "center", alignItems: "center", color: "#fbbf24" }}>
        <div style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
          <span style={{ display: "inline-block", animation: "spin 1s linear infinite", marginRight: "10px" }}>⏳</span>
          Memuat data...
        </div>
      </div>
    );
  }

  // --- RENDER HALAMAN UTAMA ---
  return (
    <div className="kasir-layout">
      
      {/* KIRI: SIDEBAR */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        user={user} 
        onLogout={handleLogout} 
      />

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        {activeView === "dashboard" && (
          <Dashboard members={members} onSelectMember={handleSelectMember} onOpenTransaction={openTransaction} user={user} />
        )}

        {activeView === "members" && (
          <MemberList 
            members={members}
            onSelectMember={(m) => {
              setSelectedMember(m);
              setActiveView("member-detail");
            }}
            onOpenTransaction={(m) => {
              setTransactionMember(m);
              setShowTransaction(true);
            }}
            onAddMember={() => setActiveView("add-member")}
            onShowQR={() => setShowQRModal(true)}
            onGoToRewards={(id) => {
              setPrefillMemberId(id);
              setActiveView("rewards");
            }}
            onRefresh={fetchMembers}
          />
        )}

        {activeView === "add-member" && (
          <AddMember 
            onBack={() => setActiveView("members")}
            onSave={async (m) => {
              await handleAddMember(m);
              setActiveView("members");
            }}
          />
        )}

        {activeView === "member-detail" && selectedMember && (
          <MemberDetail 
            member={selectedMember}
            onBack={() => {
              setSelectedMember(null);
              setActiveView("members");
            }}
            onOpenTransaction={(m) => {
              setTransactionMember(m);
              setShowTransaction(true);
            }}
            onDelete={async (id) => {
              await handleDeleteMember(id);
              setActiveView("members");
            }}
          />
        )}

        {/* REWARDS CATALOG VIEW */}
        {activeView === "rewards" && (
          <RewardsCatalog 
            members={members} 
            prefillMemberId={prefillMemberId}
            onClearPrefill={() => setPrefillMemberId(null)}
            onRedeem={handleRedeemReward} 
          />
        )}

      </main>

      {/* --- OVERLAY MODALS --- */}
      
      {/* MODAL QR */}
      {showQRModal && (
        <QRModal 
          isOpen={showQRModal} 
          onClose={() => setShowQRModal(false)} 
          storeId={user?.id || "default"} 
        />
      )}

      {/* MODAL TRANSAKSI */}
      {showTransaction && transactionMember && (
        <TransactionModal 
          member={transactionMember}
          onClose={() => setShowTransaction(false)}
          onConfirm={handleAddTransaction}
        />
      )}

      {/*Toast Notification*/}
      <Toast 
        isVisible={toast.isOpen} 
        type={toast.type === "danger" ? "error" : "success"} 
        message={toast.message} 
        onClose={hideToast}
      />

      {/* MODAL CETAK STRUK (RECEIPT) */}
      {receiptData && (
        <div className="modal-overlay">
          <div className="modal-box receipt-box">
            <h2 className="receipt-title">{user?.store_name || "TOKO DEMO"}</h2>
            <p className="receipt-text-sm">{receiptData.date}</p>
            <p className="receipt-text-sm" style={{ marginBottom: "1rem" }}>
              Pelanggan: {receiptData.member.name}
            </p>
            
            <div className="receipt-details">
              <div className="receipt-row">
                <span>Total Belanja:</span>
                <strong>Rp{receiptData.amount.toLocaleString("id-ID")}</strong>
              </div>
              <div className="receipt-row">
                <span>Poin Didapat:</span>
                <strong>+{receiptData.amount * 0.1} pts</strong>
              </div>
            </div>
            
            <div className="receipt-total-large">
              TOTAL POIN: {receiptData.points} pts
            </div>
            
            <div className="modal-actions" style={{ justifyContent: "center" }}>
              <button onClick={() => setReceiptData(null)} className="btn-receipt-close">
                Tutup
              </button>
              <button onClick={() => window.print()} className="btn-receipt-print">
                Cetak Struk
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}