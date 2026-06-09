"use client";

import { useState } from "react"; // Tambahkan useState
import { Member } from "@/data/members";
import DigitalCard from "@/components/ui/DigitalCard";
import { TierBadge } from "@/components/ui/TierBadge";
import { ArrowLeft, CreditCard, History, Share2 } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface MemberDetailProps {
  member: Member;
  onBack: () => void;
  onOpenTransaction: (member: Member) => void;
  onDelete?: (id: string) => void;
  onSendWA?: (phone: string, name: string) => void;
  onResetPoints?: (id: string) => void;
}

export default function MemberDetail({ member, onBack, onOpenTransaction, onDelete, onSendWA, onResetPoints }: MemberDetailProps) {
  
  // STATE UNTUK MENGONTROL MODAL KONFIRMASI
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    actionType: "fraud" | "delete" | null;
  }>({
    isOpen: false,
    actionType: null,
  });

  const formatWhatsAppNumber = (phone: string) => {
    let formatted = phone.replace(/\D/g, "");
    if (formatted.startsWith("0")) {
      formatted = "62" + formatted.substring(1);
    } else if (formatted.startsWith("8")) {
      formatted = "62" + formatted;
    }
    return formatted;
  };

  const waNumber = formatWhatsAppNumber(member.phone);
  const waText = encodeURIComponent(`Halo ${member.name}! 👋\n\nIni adalah informasi keanggotaan Anda.\n\nTier: *${member.tier}*\nPoin Aktif: *${Number(member.points).toLocaleString()} pts*\n\nJangan lupa tunjukkan nomor HP atau QR Code Anda ke kasir saat berkunjung untuk mengumpulkan lebih banyak poin!`);
  const waLink = `https://wa.me/${waNumber}?text=${waText}`;

  // FUNGSI YANG DIJALANKAN SAAT TOMBOL "YA, LANJUTKAN" DI MODAL DIKLIK
  const handleConfirmAction = () => {
    if (confirmConfig.actionType === "fraud" && onResetPoints) {
      onResetPoints(member.id);
    } else if (confirmConfig.actionType === "delete" && onDelete) {
      onDelete(member.id);
    }
    // Tutup modal setelah aksi dijalankan
    setConfirmConfig({ isOpen: false, actionType: null });
  };

  return (
    <div className="dashboard-container">
      <button onClick={onBack} className="btn-secondary" style={{ width: "fit-content" }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      {/* Profil Member & Kartu Digital */}
      <div className="panel-card" style={{ padding: "2rem" }}>
        <div className="detail-header" style={{ alignItems: "center", gap: "2rem" }}>
          
          <div style={{ flexShrink: 0, width: "320px" }}>
            <DigitalCard member={member} />
          </div>

          <div className="detail-info">
            <h2 className="detail-name" style={{ fontSize: "2rem" }}>{member.name}</h2>
            <p className="detail-phone" style={{ fontSize: "1rem", marginBottom: "1rem" }}>{member.phone}</p>
            
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "1rem 1.5rem", borderRadius: "1rem", width: "fit-content" }}>
              <div>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>Poin Aktif</p>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fbbf24", lineHeight: 1 }}>{Number(member.points).toLocaleString()}</p>
              </div>
              <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "1.5rem" }}>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem" }}>Status Tier</p>
                <TierBadge tier={member.tier} />
              </div>
            </div>

            <div className="action-row" style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button onClick={() => onOpenTransaction(member)} className="btn-primary" style={{ width: "fit-content" }}>
                <CreditCard size={16} /> Transaksi Baru
              </button>

              <a 
                href={waLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => onSendWA && onSendWA(member.phone, member.name)}
                style={{ 
                  display: "flex", alignItems: "center", gap: "0.5rem", 
                  background: "#25D366", color: "white", 
                  padding: "0.5rem 1rem", borderRadius: "0.5rem", 
                  border: "none", cursor: "pointer", 
                  fontWeight: "bold", textDecoration: "none",
                  fontSize: "0.875rem", transition: "all 0.2s ease-in-out"
                }}
                onMouseOver={(e) => e.currentTarget.style.filter = "brightness(1.1)"}
                onMouseOut={(e) => e.currentTarget.style.filter = "brightness(1)"}
              >
                <Share2 size={16} /> Kirim Pengingat WA
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Riwayat Transaksi */}
      <div className="panel-card" style={{ padding: "1.5rem" }}>
        <h3 className="panel-title" style={{ marginBottom: "1rem" }}><History size={16} /> Riwayat Transaksi</h3>
        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Deskripsi</th>
                <th>Nominal Belanja</th>
                <th>Mutasi Poin</th>
              </tr>
            </thead>
            <tbody>
              {member.transactions && member.transactions.length > 0 ? (
                member.transactions.map((trx) => (
                  <tr key={trx.id}>
                    <td>{new Date(trx.date).toLocaleDateString("id-ID")}</td>
                    <td>{trx.description}</td>
                    <td>{trx.amount > 0 ? `Rp${trx.amount.toLocaleString("id-ID")}` : "-"}</td>
                    <td className={trx.type === "earn" ? "type-earn" : "type-redeem"}>
                      {trx.type === "earn" ? "+" : "-"}{Math.abs(trx.points)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "rgba(255,255,255,0.4)" }}>Belum ada riwayat transaksi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Area Danger Zone */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        
        {/* Tombol HANYA membuka Modal, TIDAK pakai window.confirm lagi */}
        {onResetPoints && (
          <button 
            onClick={() => setConfirmConfig({ isOpen: true, actionType: "fraud" })} 
            style={{ 
              backgroundColor: "transparent", color: "#f59e0b", padding: "0.5rem 1rem", 
              borderRadius: "0.5rem", border: "1px solid #f59e0b", cursor: "pointer",
              fontSize: "0.875rem", transition: "all 0.2s ease-in-out"
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#f59e0b"; e.currentTarget.style.color = "black"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#f59e0b"; }}
          >
            Reset Poin (Fraud)
          </button>
        )}

        {onDelete && (
          <button 
            onClick={() => setConfirmConfig({ isOpen: true, actionType: "delete" })} 
            style={{ 
              backgroundColor: "transparent", color: "#ef4444", padding: "0.5rem 1rem", 
              borderRadius: "0.5rem", border: "1px solid #ef4444", cursor: "pointer",
              fontSize: "0.875rem", transition: "all 0.2s ease-in-out"
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#ef4444"; e.currentTarget.style.color = "white"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#ef4444"; }}
          >
            Hapus Member Permanen
          </button>
        )}
      </div>
      
      {/* RENDER MODAL DI SINI */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.actionType === "fraud" ? "⚠️ Yakin Reset Poin?" : "Hapus Member Permanen"}
        message={
          confirmConfig.actionType === "fraud"
            ? "Tindakan ini akan mengosongkan poin pelanggan jika terbukti melakukan kecurangan. Lanjutkan?"
            : "Apakah Anda yakin ingin menghapus pelanggan ini secara permanen? Semua data poin dan transaksi juga akan hilang selamanya."
        }
        type="danger"
        confirmText={confirmConfig.actionType === "fraud" ? "Ya, Reset Poin" : "Ya, Hapus Member"}
        cancelText="Batal"
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmConfig({ isOpen: false, actionType: null })}
      />

    </div>
  );
}