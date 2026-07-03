"use client";

import { useState, useEffect } from "react";
import { Mail, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import "@/css/auth/style.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState<React.CSSProperties[]>([]);

  const baseUrl = '/api';

  useEffect(() => {
    setStars([...Array(35)].map(() => ({
      width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`,
      top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.4 + 0.1,
    })));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError("Kolom wajib diisi");
      return;
    }
    setEmailError("");

    setLoading(true);

    try {
      // 1. Memanggil endpoint backend Laravel
      // Pastikan NEXT_PUBLIC_API_URL sudah ada di file .env.local Anda
      const response = await fetch(`${baseUrl}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ email: email }), // Kirim data email
      });

      const data = await response.json();

      // 2. Cek apakah backend mengembalikan respons sukses (misal 200 OK)
      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengirim link reset password.');
      }

      // 3. Jika berhasil, ubah state untuk menampilkan halaman sukses
      setSent(true);

    } catch (error: any) {
      // 4. Jika error (misal email tidak ditemukan), tampilkan pesan error
      console.error("Error dari backend:", error);
      alert(error.message); // Sementara menggunakan alert. Anda bisa menggantinya dengan teks merah di UI nanti.
    } finally {
      // 5. Matikan efek loading apa pun hasil akhirnya
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      
      {/* --- PANEL KIRI: Visual --- */}
      <div className="auth-left">
        <div className="auth-bg-gradient"></div>
        <div className="glow-circle glow-amber"></div>
        <div className="glow-circle glow-orange glow-orange-bottom"></div>
        {stars.map((style, i) => <div key={i} className="star" style={style} />)}

        <div className="auth-content">
          <div className="auth-brand">
            <div className="auth-logo-box"><Sparkles size={20} color="white" /></div>
            <div className="auth-brand-text">
              <strong className="auth-brand-title">LoyaltiKu</strong>
              <div className="auth-brand-subtitle">UMKM CRM</div>
            </div>
          </div>
          <h1 className="auth-title">
            LUPA <br/><span className="text-gradient">PASSWORD?</span>
          </h1>
          <p className="auth-subtitle mt-4">
            Jangan khawatir, kami akan mengirimkan instruksi untuk masuk kembali ke akun Anda.
          </p>
        </div>
      </div>

      {/* --- PANEL KANAN: Form --- */}
      <div className="auth-right">
        <div className="auth-right-bg"></div>
        <div className="form-wrapper">
          
          {!sent ? (
            <form onSubmit={handleSubmit} className="form-layout" noValidate>
              <div className="form-header">
                <h2>Reset Password</h2>
                <p>Masukkan email yang terdaftar untuk menerima link reset.</p>
              </div>

              <div className={`input-group ${emailError ? "has-error" : ""}`}>
                <Mail size={16} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="Email Anda" 
                  className="form-input" 
                  value={email} 
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }} 
                />
              </div>
              {emailError && <span className="field-error">{emailError}</span>}

              <button type="submit" className="auth-btn-primary" disabled={loading}>
                {loading ? "Mengirim..." : <>Kirim Link Reset <ArrowRight size={16} /></>}
              </button>

              <div className="auth-footer mt-4">
                <Link href="/auth/login" className="auth-link-muted">
                  <ArrowLeft size={14} style={{ marginTop: "1px" }} /> Kembali ke Login
                </Link>
              </div>
            </form>
          ) : (
            // State Jika Email Berhasil Dikirim
            <div className="text-center form-layout">
              <div className="icon-circle-amber">
                <Mail size={30} color="white" />
              </div>
              
              <div>
                <h2 className="text-success text-2xl font-bold">Email Terkirim!</h2>
                <p className="text-muted text-sm mt-4" style={{ lineHeight: "1.5" }}>
                  Kami sudah mengirim link reset ke <br/>
                  <strong className="text-amber">{email}</strong>
                </p>
              </div>

              <button onClick={() => setSent(false)} className="auth-btn-secondary" style={{ justifyContent: "center" }}>
                Kirim Ulang
              </button>
              
              <Link href="/auth/login" style={{ textDecoration: "none" }}>
                <button className="auth-btn-primary" style={{ marginTop: "0" }}>
                  Kembali ke Login
                </button>
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}