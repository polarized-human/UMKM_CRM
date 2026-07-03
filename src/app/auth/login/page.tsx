"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/css/auth/style.css"; 

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [stars, setStars] = useState<React.CSSProperties[]>([]);
  const router = useRouter();
  const baseUrl = '/api';

  useEffect(() => {
    setStars([...Array(35)].map(() => ({
      width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`,
      top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.4 + 0.1,
    })));
  }, []);

  const update = (k: string, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};
    if (!form.email.trim()) newErrors.email = "Kolom wajib diisi";
    if (!form.password.trim()) newErrors.password = "Kolom wajib diisi";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    
    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(form)
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email atau password salah.");
      }

      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
      }

      router.push('/cashier');
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Gagal masuk. Periksa kembali email dan password Anda.");
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
            SELAMAT <br/><span className="text-gradient">DATANG</span><br/>KEMBALI!
          </h1>
          <p className="auth-subtitle">Masuk untuk mengelola loyalitas pelanggan Anda</p>
        </div>
      </div>

      {/* KANAN - Form */}
      <div className="auth-right">
        <div className="auth-right-bg"></div>
        <div className="form-wrapper">
          <form onSubmit={handleSubmit} className="form-layout" noValidate>
            <div className="form-header">
              <h2>Masuk ke Akun</h2>
              <p>Masukkan email dan password Anda</p>
            </div>

            <div className={`input-group ${errors.email ? "has-error" : ""}`}>
              <Mail size={16} className="input-icon" />
              <input 
                type="email" 
                placeholder="Email" 
                className="form-input" 
                value={form.email} 
                onChange={(e) => { update("email", e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }} 
              />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
            
            <div className={`input-group ${errors.password ? "has-error" : ""}`}>
              <Lock size={16} className="input-icon" />
              <input 
                type={showPass ? "text" : "password"} 
                placeholder="Password" 
                className="form-input" 
                value={form.password} 
                onChange={(e) => { update("password", e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: undefined })); }} 
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)} 
                className="btn-icon-absolute"
              >
                {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}

            <div className="form-actions">
              <Link href="/auth/forgot-password" className="link-amber link-amber-sm">
                Lupa Password?
              </Link>
            </div>

            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? "Memproses..." : <>Masuk <ArrowRight size={16} /></>}
            </button>

            <div className="auth-footer">
              <p>
                Belum punya akun?{" "}
                <Link href="/auth/register" className="link-amber">
                  Daftar di sini
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}