"use client";

import { useState } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Member } from "@/data/members";
import "@/css/cashier/style.css";

interface AddMemberProps {
  onBack: () => void;
  onSave: (member: Member) => void;
}

export default function AddMember({ onBack, onSave }: AddMemberProps) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", birthDate: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulasi pembuatan data member baru sebelum dikirim ke API/Backend
    const newMember: Member = {
      id: "M-" + Math.floor(Math.random() * 10000),
      name: form.name,
      phone: form.phone,
      email: form.email,
      birthDate: form.birthDate,
      birth_date: form.birthDate,
      points: 0,
      tier: "Bronze",
      totalSpend: 0,
      joinDate: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      avatar: form.name.substring(0, 2).toUpperCase(),
      transactions: [],
    };

    onSave(newMember);
  };

  return (
    <div className="dashboard-container">
      <button onClick={onBack} className="btn-secondary" style={{ width: "fit-content", marginBottom: "1rem" }}>
        <ArrowLeft size={16} /> Kembali
      </button>

      <div className="panel-card" style={{ maxWidth: "500px" }}>
        <div className="panel-header">
          <h3 className="panel-title" style={{ fontSize: "1.125rem" }}>
            <UserPlus size={18} color="#fbbf24" /> Daftarkan Member Baru
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: "1.5rem" }}>
          <div className="form-group">
            <label className="form-label">Nama Pelanggan *</label>
            <input 
              type="text" 
              className="dash-input" 
              placeholder="Contoh: Budi Santoso" 
              value={form.name} 
              onChange={(e) => setForm({...form, name: e.target.value})} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nomor WhatsApp *</label>
            <input 
              type="tel" 
              className="dash-input" 
              placeholder="Contoh: 08123456789" 
              value={form.phone} 
              onChange={(e) => setForm({...form, phone: e.target.value})} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="birth_date">Tanggal Lahir (Optional)</label>
            <input 
              type="date" 
              id="birth_date"
              name="birth_date"
              value={form.birthDate}
              onChange={(e) => setForm({...form, birthDate: e.target.value})}
              className="dash-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email (Opsional)</label>
            <input 
              type="email" 
              className="dash-input" 
              placeholder="Contoh: budi@email.com" 
              value={form.email} 
              onChange={(e) => setForm({...form, email: e.target.value})} 
            />
          </div>

          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="dash-btn-primary">
              Simpan Data Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}