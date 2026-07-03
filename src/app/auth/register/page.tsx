"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import "@/css/auth/style.css"; 

// Data statis dikeluarkan agar tidak membebani render ulang
const STORE_TYPES = ["Fashion & Pakaian", "Makanan & Minuman", "Kecantikan & Perawatan", "Elektronik", "Kebutuhan Rumah", "Lainnya"];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", storeName: "", storeType: "", city: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stars, setStars] = useState<React.CSSProperties[]>([]);
  const baseUrl = '/api';

  useEffect(() => {
    setStars([...Array(35)].map(() => ({
      width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`,
      top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.4 + 0.1,
    })));
  }, []);

  const update = (k: string, v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
  };
  
  const handleNext = (e: React.FormEvent) => { 
    e.preventDefault(); 
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Kolom wajib diisi";
    if (!form.email.trim()) newErrors.email = "Kolom wajib diisi";
    if (!form.phone.trim()) newErrors.phone = "Kolom wajib diisi";
    if (!form.password.trim()) newErrors.password = "Kolom wajib diisi";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    if (step < 2) setStep(step + 1); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!form.storeName.trim()) newErrors.storeName = "Kolom wajib diisi";
    if (!form.city.trim()) newErrors.city = "Kolom wajib diisi";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/register`, {
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
      {/* KIRI - Visual */}
      <div className="auth-left">
        <div className="auth-bg-gradient"></div>
        <div className="glow-circle glow-amber"></div>
        <div className="glow-circle glow-orange"></div>
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
            MULAI <br/><span className="text-gradient">PERJALANAN</span><br/>BISNISMU!
          </h1>
        </div>
      </div>

      {/* KANAN - Form */}
      <div className="auth-right">
        <div className="auth-right-bg"></div>
        <div className="form-wrapper">
          
          {step === 0 && (
            <form onSubmit={handleNext} className="form-layout" noValidate>
              <div className="form-header">
                <h2>Buat Akun</h2>
              </div>
              
              <div className={`input-group ${errors.name ? "has-error" : ""}`}>
                <User size={16} className="input-icon" />
                <input type="text" placeholder="Nama Lengkap" className="form-input" value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              {errors.name && <span className="field-error">{errors.name}</span>}
              
              <div className={`input-group ${errors.email ? "has-error" : ""}`}>
                <Mail size={16} className="input-icon" />
                <input type="email" placeholder="Email" className="form-input" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
              
              <div className={`input-group ${errors.phone ? "has-error" : ""}`}>
                <Phone size={16} className="input-icon" />
                <input type="tel" placeholder="Nomor HP" className="form-input" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              {errors.phone && <span className="field-error">{errors.phone}</span>}
              
              <div className={`input-group ${errors.password ? "has-error" : ""}`}>
                <Lock size={16} className="input-icon" />
                <input type={showPass ? "text" : "password"} placeholder="Password" className="form-input" value={form.password} onChange={(e) => update("password", e.target.value)} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="btn-icon-absolute">
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
              
              <button type="submit" className="auth-btn-primary">
                Lanjut <ArrowRight size={16} />
              </button>

              <div className="auth-footer">
                <p>
                  Sudah punya akun?{" "}
                  <Link href="/auth/login" className="link-amber">
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={handleSubmit} className="form-layout" noValidate>
              <div className="form-header">
                <h2>Info Toko</h2>
                <p>Data toko atau usaha Anda</p>
              </div>

              <div className={`input-group ${errors.storeName ? "has-error" : ""}`}>
                <Building2 size={16} className="input-icon" />
                <input type="text" placeholder="Nama Toko" className="form-input" value={form.storeName} onChange={(e) => update("storeName", e.target.value)} />
              </div>
              {errors.storeName && <span className="field-error">{errors.storeName}</span>}

              <div>
                <span className="store-type-label">Jenis Usaha</span>
                <div className="store-type-grid">
                  {STORE_TYPES.map((t) => (
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

              <div className={`input-group ${errors.city ? "has-error" : ""}`}>
                <input type="text" placeholder="Kota / Kabupaten" className="form-input pl-4" value={form.city} onChange={(e) => update("city", e.target.value)} />
              </div>
              {errors.city && <span className="field-error">{errors.city}</span>}
              
              <div className="flex-row">
                <button type="button" onClick={() => setStep(0)} className="auth-btn-secondary">
                  <ArrowLeft size={16}/> Kembali
                </button>
                <button type="submit" className="auth-btn-primary" disabled={loading || !form.storeType}>
                  {loading ? "Memproses..." : "Daftar Sekarang"}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="text-center">
              <h2 className="text-success mb-4 text-2xl font-bold">Berhasil! 🎉</h2>
              <p className="text-muted text-sm">Akun {form.storeName} telah dibuat.</p>
              <Link href="/auth/login">
                <button className="auth-btn-primary mt-8">Mulai Sekarang</button>
              </Link>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}