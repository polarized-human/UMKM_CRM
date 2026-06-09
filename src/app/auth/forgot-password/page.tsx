"use client";

import { useState, useEffect } from "react";
import { Mail, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import "@/css/auth/style.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    setStars([...Array(35)].map(() => ({
      width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`,
      top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.4 + 0.1,
    })));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulasi API
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="auth-container">
      {/* Panel Kiri */}
      <div className="auth-left">
        <div className="auth-bg-gradient"></div>
        <div className="glow-circle glow-amber"></div>
        <div className="glow-circle glow-orange" style={{ bottom: '-40px', right: '-60px', left: 'auto' }}></div>
        {stars.map((style, i) => <div key={i} className="star" style={style} />)}

        <div className="auth-content">
          <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", marginBottom: "3rem" }}>
            <div className="auth-logo-box"><Sparkles size={20} color="white" /></div>
            <div style={{ textAlign: "left" }}>
              <strong style={{ fontSize: "1.2rem" }}>LoyaltiKu</strong>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>UMKM CRM</div>
            </div>
          </div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", fontWeight: "bold" }}>LUPA <br/><span className="text-gradient">PASSWORD?</span></h1>
          <p style={{ color: "rgba(255,255,255,0.4)", lineHeight: "1.5" }}>Jangan khawatir, kami akan mengirimkan instruksi untuk masuk kembali ke akun Anda.</p>
        </div>
      </div>

      {/* Panel Kanan */}
      <div className="auth-right">
        <div className="auth-right-bg"></div>
        <div className="form-wrapper">
          {!sent ? (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <h2>Reset Password</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", marginTop: "0.5rem" }}>Masukkan email yang terdaftar untuk menerima link reset.</p>
              </div>

              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input type="email" placeholder="Email Anda" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Mengirim..." : <>Kirim Link Reset <ArrowRight size={16} /></>}
              </button>

              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <Link href="/auth/login" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", textDecoration: "none" }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <ArrowLeft size={14}/> Kembali ke Login
                  </span>
                </Link>
              </div>
            </form>
          ) : (
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ margin: "0 auto", width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(to bottom right, #f59e0b, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Mail size={30} color="white" />
              </div>
              <div>
                <h2 style={{ color: "#4ade80" }}>Email Terkirim!</h2>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", marginTop: "0.75rem", lineHeight: "1.5" }}>
                  Kami sudah mengirim link reset ke <br/><strong className="text-amber">{email}</strong>
                </p>
              </div>
              <button onClick={() => setSent(false)} className="btn-secondary" style={{ justifyContent: "center" }}>Kirim Ulang</button>
              <Link href="/auth/login" style={{ textDecoration: "none" }}>
                <button className="btn-primary">Kembali ke Login</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}