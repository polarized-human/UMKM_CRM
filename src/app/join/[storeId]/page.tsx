"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { User, Phone, Sparkles, Check } from "lucide-react";
import "@/css/auth/style.css";

export default function JoinMemberPage() {
  const params = useParams();
  const storeId = params.storeId;

  const [form, setForm] = useState({ name: "", phone: "", birthDate: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [stars, setStars] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    setStars([...Array(30)].map(() => ({
      width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`,
      top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.4 + 0.1,
    })));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Tembak API backend Laravel di sini
    // POST /api/customers/join
    // body: { store_id: storeId, ...form }
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="auth-container">
      {/* BACKGROUND EFFECTS */}
      <div className="auth-bg-gradient"></div>
      <div className="glow-circle glow-amber"></div>
      <div className="glow-circle glow-orange" style={{ bottom: '-60px', right: '-40px', left: 'auto' }}></div>
      {stars.map((style, i) => <div key={i} className="star" style={style} />)}

      {/* CENTER CONTENT */}
      <div className="auth-center-wrapper">
        <div className="join-form-box">
          
          <div className="auth-brand mb-8">
            <div className="auth-logo-box"><Sparkles size={20} color="white" /></div>
            <div className="auth-brand-text">
              <strong className="auth-brand-title text-white">LoyaltiKu</strong>
              <div className="auth-brand-subtitle">Daftar Member</div>
            </div>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="form-layout">
              <div className="text-center mb-4">
                <h2 className="text-white text-xl font-bold">Daftar Member Toko</h2>
                <p className="text-muted text-sm mt-2">Kumpulkan poin dan nikmati hadiahnya!</p>
              </div>

              <div className="input-group">
                <User size={16} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Nama Lengkap" 
                  className="form-input" 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  required 
                />
              </div>

              <div className="input-group">
                <Phone size={16} className="input-icon" />
                <input 
                  type="tel" 
                  placeholder="Nomor WhatsApp" 
                  className="form-input" 
                  value={form.phone} 
                  onChange={(e) => setForm({...form, phone: e.target.value})} 
                  required 
                />
              </div>

              <div>
                <p className="store-type-label">Tanggal Lahir (Opsional - Untuk Kejutan Ultah!)</p>
                <div className="input-group">
                  <input 
                    type="date" 
                    className="form-input pl-4" 
                    value={form.birthDate} 
                    onChange={(e) => setForm({...form, birthDate: e.target.value})} 
                    style={{ colorScheme: "dark" }} // colorScheme tetap sebaris karena spesifik browser rendering
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary mt-4" disabled={loading}>
                {loading ? "Memproses..." : "Daftar Sekarang"}
              </button>
            </form>
          ) : (
            
            // SUCCESS STATE
            <div className="text-center" style={{ padding: "2rem 0" }}>
              <div className="success-circle">
                <Check size={30} color="white" />
              </div>
              <h2 className="text-white text-xl font-bold mb-2">Pendaftaran Berhasil!</h2>
              <p className="text-muted text-sm" style={{ lineHeight: 1.5 }}>
                Terima kasih, Anda sudah terdaftar sebagai member. Silakan beri tahu nomor HP Anda ke kasir.
              </p>
            </div>
            
          )}

        </div>
      </div>
    </div>
  );
}