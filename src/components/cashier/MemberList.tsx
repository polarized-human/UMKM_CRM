"use client";

import { useState } from "react";
import { Member } from "@/data/members";
import { TierBadge, TierRing } from "@/components/ui/TierBadge";
import { Search, CreditCard, Gift, QrCode } from "lucide-react";
import "@/css/cashier/style.css"; 

interface MemberListProps {
  members: Member[];
  onSelectMember: (member: Member) => void;
  onOpenTransaction: (member: Member) => void;
  onAddMember: () => void;
  onShowQR: () => void;
  onGoToRewards: (memberId: string) => void;
  onRefresh: () => void;
  onSendWA?: (phone: string, name: string) => void | Promise<void>;
}

function formatRupiah(val: number | string) {
  const amount = Number(val) || 0; 
  if (amount >= 1000000) return `Rp${(amount / 1000000).toFixed(1)}jt`;
  if (amount >= 1000) return `Rp${(amount / 1000).toFixed(0)}rb`;
  return `Rp${Math.floor(amount)}`;
}

export default function MemberList({ members, onSelectMember, onOpenTransaction, onAddMember,  onShowQR, onGoToRewards, onRefresh, onSendWA }: MemberListProps) {
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search)
  );

  return (
    <div className="dashboard-container">
      {/* Header & Search */}
      <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={onRefresh} className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "transparent", color: "#fbbf24", border: "1px solid #fbbf24" }}>
            Segarkan Data
          </button>
          <button onClick={onShowQR} className="btn-secondary">QR Member</button>
          <button onClick={onAddMember} className="dash-btn-primary">+ Tambah Member</button>
        </div>

      {/* Tabel Member */}
      <div className="panel-card" style={{ padding: "0 1rem", marginTop: "1rem" }}>
        <div className="table-wrapper">
          <table className="member-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Nomor HP</th>
                <th>Poin</th>
                <th>Total Belanja</th>
                <th>Kunjungan</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.3)" }}>
                    Member tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr key={m.id} className="member-row" onClick={() => onSelectMember(m)}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <TierRing tier={m.tier} avatar={m.avatar} size="sm" />
                        <div>
                          <div style={{ fontWeight: 500, color: "#fff" }}>{m.name}</div>
                          <div style={{ marginTop: "0.25rem" }}><TierBadge tier={m.tier} /></div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "rgba(255,255,255,0.6)" }}>{m.phone}</td>
                    <td style={{ fontWeight: 600, color: "#fbbf24" }}>{Number(m.points || 0).toLocaleString()}</td>
                    <td style={{ color: "#fff" }}>{formatRupiah(m.totalSpend)}</td>
                    <td style={{ color: "rgba(255,255,255,0.6)" }}>{new Date(m.lastVisit).toLocaleDateString("id-ID")}</td>
                    <td>
                      {/* Tombol Aksi */}
                      <div className="action-buttons">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onGoToRewards(m.id);
                          }} 
                          className="btn-redeem"
                          style={{ /* Null */ }}>
                          Tukar Poin
                        </button>

                        {/* Tombol Transaksi ... */}
                        <button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            onOpenTransaction(m); 
                          }}
                          className="btn-transaction"
                        >
                          <CreditCard size={14} /> Transaksi
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}