"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, Sparkles, ArrowRight, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import "@/css/auth/style.css"; // IMPORT CSS KHUSUS AUTH

const steps = ["Akun", "Bisnis", "Selesai"];
const storeTypes = ["Fashion & Pakaian", "Makanan & Minuman", "Kecantikan & Perawatan", "Elektronik", "Kebutuhan Rumah", "Lainnya"];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
    const [sent, setSent] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", storeName: "", storeType: "", city: "" });
  const [stars, setStars] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    setStars([...Array(35)].map(() => ({
      width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`,
      top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.4 + 0.1,
    })));
  }, []);

  const update = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }));
  const handleNext = (e: React.FormEvent) => { e.preventDefault(); if (step < 2) setStep(step + 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Pendaftaran gagal.");
      setStep(2);
    } catch (error) {
      alert("Terjadi kesalahan saat mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* KIRI */}
      <div className="auth-left">
        <div className="auth-bg-gradient"></div>
        <div className="glow-circle glow-amber"></div>
        <div className="glow-circle glow-orange"></div>
        {stars.map((style, i) => <div key={i} className="star" style={style} />)}

        <div className="auth-content">
          <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", marginBottom: "3rem" }}>
            <div className="auth-logo-box"><Sparkles size={20} color="white" /></div>
            <div style={{ textAlign: "left" }}>
              <strong style={{ fontSize: "1.2rem" }}>LoyaltiKu</strong>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>UMKM CRM</div>
            </div>
          </div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", fontWeight: "bold" }}>MULAI <br/><span className="text-gradient">PERJALANAN</span><br/>BISNISMU!</h1>
        </div>
      </div>

      {/* KANAN */}
      <div className="auth-right">
        <div className="auth-right-bg"></div>
        <div className="form-wrapper">
          
          {step === 0 && (
            <form onSubmit={handleNext} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h2>Buat Akun</h2>
              <div className="input-group">
                <User size={16} className="input-icon" />
                <input type="text" placeholder="Nama Lengkap" className="form-input" value={form.name} onChange={(e) => update("name", e.target.value)} required />
              </div>
              <div className="input-group">
                <Mail size={16} className="input-icon" />
                <input type="email" placeholder="Email" className="form-input" value={form.email} onChange={(e) => update("email", e.target.value)} required />
              </div>
              <div className="input-group">
                <Phone size={16} className="input-icon" />
                <input type="tel" placeholder="Nomor HP" className="form-input" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
              </div>
              <div className="input-group">
                <Lock size={16} className="input-icon" />
                <input type={showPass ? "text" : "password"} placeholder="Password" className="form-input" value={form.password} onChange={(e) => update("password", e.target.value)} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "1rem", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              <button type="submit" className="btn-primary">Lanjut <ArrowRight size={16} /></button>

              <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>
                  Sudah punya akun?{" "}
                  <Link href="/auth/login" style={{ color: "#fbbf24", textDecoration: "none", fontWeight: 600 }}>
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <h2>Info Toko</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Data toko atau usaha Anda</p>
              </div>

              <div className="input-group">
                <Building2 size={16} className="input-icon" />
                <input type="text" placeholder="Nama Toko" className="form-input" value={form.storeName} onChange={(e) => update("storeName", e.target.value)} required />
              </div>

              {/* INI BAGIAN YANG SEMPAT HILANG */}
              <div>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>Jenis Usaha</p>
                <div className="store-type-grid">
                  {storeTypes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => update("storeType", t)}
                      className={`btn-store-type ${form.storeType === t ? "selected" : ""}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <input type="text" placeholder="Kota / Kabupaten" className="form-input" style={{ paddingLeft: "1rem" }} value={form.city} onChange={(e) => update("city", e.target.value)} required />
              </div>
              
              <div className="flex-row" style={{ marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setStep(0)} className="btn-secondary"><ArrowLeft size={16}/> Kembali</button>
                <button type="submit" className="btn-primary" disabled={loading || !form.storeType}>
                  {loading ? "Memproses..." : "Daftar Sekarang"}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div style={{ textAlign: "center" }}>
              <h2 style={{ color: "#4ade80", marginBottom: "1rem" }}>Berhasil! 🎉</h2>
              <p>Akun {form.storeName} telah dibuat.</p>
              <Link href="auth/login" style={{ textDecoration: "none" }}><button className="btn-primary" style={{ marginTop: "2rem" }}>Mulai Sekarang</button></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}