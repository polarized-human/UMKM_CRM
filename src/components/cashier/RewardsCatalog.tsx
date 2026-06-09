"use client";

import { useState, useEffect } from "react";
import { Member } from "@/data/members";
import { Gift, Coffee, Tag, CheckCircle } from "lucide-react";
// Pastikan baris ini ada agar file CSS terbaca
import "@/css/cashier/style.css"; 

interface RewardsCatalogProps {
  members: Member[];
  prefillMemberId?: string | null;
  onClearPrefill?: () => void;
  onRedeem: (memberId: string, rewardName: string, pointsNeeded: number) => Promise<boolean>;
}

export default function RewardsCatalog({ members, prefillMemberId, onClearPrefill, onRedeem }: RewardsCatalogProps) {
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
      if (prefillMemberId) {
        setSelectedMemberId(prefillMemberId);
      }
      return () => {
        if (onClearPrefill) onClearPrefill();
      };
    }, [prefillMemberId, onClearPrefill]);

  const rewards = [
    { id: 1, name: "Voucher Diskon 10%", points: 500, icon: Tag },
    { id: 2, name: "Gratis Kopi / Minuman", points: 800, icon: Coffee },
    { id: 3, name: "Merchandise Kaos", points: 1500, icon: Gift },
  ];

  const handleConfirmRedeem = async () => {
    if (!selectedMemberId) {
      alert("Silakan pilih member terlebih dahulu!");
      return;
    }

    setIsProcessing(true);
    const success = await onRedeem(selectedMemberId, selectedReward.name, selectedReward.points);
    setIsProcessing(false);
    
    if (success) {
      setSelectedReward(null); 
      setSelectedMemberId(""); 
    }
  };

  return (
    <div className="dashboard-container">
      <div className="panel-header" style={{ marginBottom: "2rem" }}>
        <div>
          <h2 className="page-title">Katalog Hadiah</h2>
          <p className="page-subtitle">Tukarkan poin member dengan hadiah menarik</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
        {rewards.map((reward) => (
          <div key={reward.id} className="panel-card" style={{ padding: "2rem", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <div style={{ padding: "1rem", backgroundColor: "rgba(251, 191, 36, 0.1)", borderRadius: "50%" }}>
                <reward.icon size={32} color="#fbbf24" />
              </div>
            </div>
            <h3 style={{ fontSize: "1.125rem", color: "white", marginBottom: "0.5rem" }}>{reward.name}</h3>
            <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#fbbf24", marginBottom: "1.5rem" }}>
              {reward.points} pts
            </p>
            <button 
              onClick={() => setSelectedReward(reward)}
              className="btn-reward-outline"
            >
              Tukar Poin
            </button>
          </div>
        ))}
      </div>

      {selectedReward && (
        <div className="modal-overlay">
          <div className="panel-card modal-card-solid">
            <h3 style={{ color: "white", marginBottom: "0.5rem", fontSize: "1.25rem" }}>Konfirmasi Penukaran</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
              Hadiah: <strong style={{ color: "#fbbf24" }}>{selectedReward.name}</strong> ({selectedReward.points} pts)
            </p>

            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", color: "white", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Pilih Member</label>
              <select 
                className="input-select-solid" 
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
              >
                <option value="">-- Cari Nama Pelanggan --</option>
                {members.filter(m => Number(m.points) >= selectedReward.points).map(m => (
                  <option key={m.id} value={m.id || (m as any).member_id}>
                    {m.name} ({m.points} pts)
                  </option>
                ))}
              </select>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>
                *Hanya menampilkan pelanggan dengan poin yang mencukupi.
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setSelectedReward(null)} 
                className="btn-cancel-outline"
                disabled={isProcessing}
              >
                Batal
              </button>
              <button 
                onClick={handleConfirmRedeem} 
                className="btn-warning-solid"
                disabled={isProcessing}
              >
                {isProcessing ? "Memproses..." : <><CheckCircle size={16} /> Konfirmasi</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}