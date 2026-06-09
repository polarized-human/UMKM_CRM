"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { User, Phone, Sparkles, Check } from "lucide-react";
import "@/css/auth/style.css";

export default function JoinMemberPage() {
  const params = useParams();
  const storeId = params.storeId; // Menangkap ID toko dari URL URL

  const [form, setForm] = useState({ name: "", phone: "", birthDate: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [stars, setStars] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    // Efek bintang-bintang background
    setStars([...Array(30)].map(() => ({
      width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`,
      top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.4 + 0.1,
    })));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Di sini nanti kamu akan menembak API backend Laravel:
    // POST /api/customers/join
    // body: { store_id: storeId, ...form }
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-gradient"></div>
      <div className="glow-circle glow-amber"></div>
      <div className="glow-circle glow-orange"></div>
      {stars.map((style, i) => <div key={i} className="star" style={style} />)}

      <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "1rem" }}>
        <div className="form-wrapper" style={{ background: "rgba(10, 10, 15, 0.8)", padding: "2.5rem 2rem", borderRadius: "1.5rem", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
          
          <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", marginBottom: "2rem" }}>
            <div className="auth-logo-box"><Sparkles size={20} color="white" /></div>
            <div style={{ textAlign: "left" }}>
              <strong style={{ fontSize: "1.2rem", color: "white" }}>LoyaltiKu</strong>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Daftar Member</div>
            </div>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <h2 style={{ color: "white", fontSize: "1.25rem" }}>Daftar Member Toko</h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Kumpulkan poin dan nikmati hadiahnya!</p>
              </div>

              <div className="input-group">
                <User size={16} className="input-icon" />
                <input type="text" placeholder="Nama Lengkap" className="form-input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="input-group">
                <Phone size={16} className="input-icon" />
                <input type="tel" placeholder="Nomor WhatsApp" className="form-input" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} required />
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>Tanggal Lahir (Opsional - Untuk Kejutan Ultah!)</p>
                <input type="date" className="form-input" value={form.birthDate} onChange={(e) => setForm({...form, birthDate: e.target.value})} style={{ colorScheme: "dark", paddingLeft: "1rem" }} />
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "1rem" }}>
                {loading ? "Memproses..." : "Daftar Sekarang"}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ width: "60px", height: "60px", background: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <Check size={30} color="white" />
              </div>
              <h2 style={{ color: "white", marginBottom: "0.5rem" }}>Pendaftaran Berhasil!</h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", lineHeight: 1.5 }}>Terima kasih, Anda sudah terdaftar sebagai member. Silakan beri tahu nomor HP Anda ke kasir.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}