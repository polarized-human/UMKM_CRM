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
  const [stars, setStars] = useState<React.CSSProperties[]>([]);
  const router = useRouter();

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
    setLoading(true);
    
    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
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

      // Menyimpan token akses dari Laravel (Sanctum/JWT) ke LocalStorage
      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
      }

      // Mengarahkan langsung ke halaman kasir
      router.push('/cashier');
      
    } catch (error) {
      console.error(error);
      alert("Gagal masuk. Periksa kembali email dan password Anda.");
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
          <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", marginBottom: "3rem" }}>
            <div className="auth-logo-box"><Sparkles size={20} color="white" /></div>
            <div style={{ textAlign: "left" }}>
              <strong style={{ fontSize: "1.2rem" }}>LoyaltiKu</strong>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>UMKM CRM</div>
            </div>
          </div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", fontWeight: "bold" }}>
            SELAMAT <br/><span className="text-gradient">DATANG</span><br/>KEMBALI!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>Masuk untuk mengelola loyalitas pelanggan Anda</p>
        </div>
      </div>

      {/* KANAN - Form */}
      <div className="auth-right">
        <div className="auth-right-bg"></div>
        <div className="form-wrapper">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <h2>Masuk ke Akun</h2>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", marginTop: "0.5rem", marginBottom: "1rem" }}>
                Masukkan email dan password Anda
              </p>
            </div>

            <div className="input-group">
              <Mail size={16} className="input-icon" />
              <input 
                type="email" 
                placeholder="Email" 
                className="form-input" 
                value={form.email} 
                onChange={(e) => update("email", e.target.value)} 
                required 
              />
            </div>
            
            <div className="input-group">
              <Lock size={16} className="input-icon" />
              <input 
                type={showPass ? "text" : "password"} 
                placeholder="Password" 
                className="form-input" 
                value={form.password} 
                onChange={(e) => update("password", e.target.value)} 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)} 
                style={{ position: "absolute", right: "1rem", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}
              >
                {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link href="/auth/forgot-password" style={{ color: "#fbbf24", fontSize: "0.75rem", textDecoration: "none", fontWeight: 500 }}>
                Lupa Password?
              </Link>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "0.5rem" }}>
              {loading ? "Memproses..." : <>Masuk <ArrowRight size={16} /></>}
            </button>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>
                Belum punya akun?{" "}
                <Link href="/auth/register" style={{ color: "#fbbf24", textDecoration: "none", fontWeight: 600 }}>
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