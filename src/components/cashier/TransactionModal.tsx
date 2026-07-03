"use client";

import { useState } from "react";
import { Member } from "@/data/members";
import { X } from "lucide-react";
import "@/css/cashier/components.css";

interface TransactionModalProps {
  member: Member;
  onClose: () => void;
  onConfirm: (memberId: string, amount: number, points: number) => void;
}

export default function TransactionModal({ member, onClose, onConfirm }: TransactionModalProps) {
  const [amount, setAmount] = useState("");

  const numAmount = Number(amount.replace(/\D/g, ""));
  // Asumsi perhitungan poin: Rp 1.000 = 1 Poin
  const earnedPoints = Math.floor(numAmount / 1000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount > 0) {
      onConfirm(member.id, numAmount, earnedPoints);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 className="modal-title" style={{ margin: 0 }}>Tambah Transaksi</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", marginBottom: "1.5rem" }}>
          Kasir memproses belanja untuk: <strong style={{ color: "#fff" }}>{member.name}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="trx-input-group">
            <label className="trx-label">Nominal Belanja (Rp)</label>
            <input
              type="text"
              className="trx-input"
              placeholder="Contoh: 150000"
              value={amount}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setAmount(val ? parseInt(val).toLocaleString("id-ID") : "");
              }}
              autoFocus
              required
            />
          </div>

          {numAmount > 0 && (
            <div className="trx-preview">
              <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>Estimasi Poin Didapat:</span>
              <strong style={{ color: "#10b981", fontSize: "1.25rem" }}>+{earnedPoints} pts</strong>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-modal-cancel">Batal</button>
            <button type="submit" className="btn-modal-confirm" disabled={numAmount <= 0}>
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}