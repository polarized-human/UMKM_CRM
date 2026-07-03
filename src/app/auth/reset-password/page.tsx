"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import "@/css/auth/style.css"; // Pastikan path CSS ini sesuai dengan milik Anda

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Menangkap token dan email dari URL (misal: ?token=xyz&email=abc)
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; passwordConfirmation?: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const baseUrl = '/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const newFieldErrors: { password?: string; passwordConfirmation?: string } = {};
    if (!password.trim()) newFieldErrors.password = "Kolom wajib diisi";
    if (!passwordConfirmation.trim()) newFieldErrors.passwordConfirmation = "Kolom wajib diisi";
    setFieldErrors(newFieldErrors);
    if (Object.keys(newFieldErrors).length > 0) return;

    setLoading(true);

    if (password !== passwordConfirmation) {
      setMessage("Password dan konfirmasi password tidak cocok!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          token: token,
          email: email,
          password: password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mereset password. Token mungkin kadaluarsa.");
      }

      setIsSuccess(true);
      setMessage("Password berhasil diubah! Mengalihkan ke halaman login...");
      
      // Alihkan ke login setelah 2 detik
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);

    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Menggunakan style auth yang sudah Anda miliki sebelumnya */}
      <div className="auth-right auth-right-full">
        <div className="form-wrapper">
          
          <form onSubmit={handleSubmit} className="form-layout" noValidate>
            <div className="form-header text-center">
              <h2>Buat Password Baru</h2>
              <p className="text-muted text-sm mt-2">
                Masukkan password baru untuk <br/><strong className="text-amber">{email}</strong>
              </p>
            </div>

            {message && (
              <div className={`form-message ${isSuccess ? "success" : "error"}`}>
                {message}
              </div>
            )}

            <div className={`input-group ${fieldErrors.password ? "has-error" : ""}`}>
              <input 
                type="password" 
                placeholder="Password Baru" 
                className="form-input" 
                value={password} 
                onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined })); }} 
                minLength={8}
              />
            </div>
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}

            <div className={`input-group mt-3 ${fieldErrors.passwordConfirmation ? "has-error" : ""}`}>
              <input 
                type="password" 
                placeholder="Konfirmasi Password Baru" 
                className="form-input" 
                value={passwordConfirmation} 
                onChange={(e) => { setPasswordConfirmation(e.target.value); if (fieldErrors.passwordConfirmation) setFieldErrors((p) => ({ ...p, passwordConfirmation: undefined })); }} 
                minLength={8}
              />
            </div>
            {fieldErrors.passwordConfirmation && <span className="field-error">{fieldErrors.passwordConfirmation}</span>}

            <button type="submit" className="auth-btn-primary mt-4" disabled={loading || isSuccess}>
              {loading ? "Menyimpan..." : "Simpan Password Baru"}
            </button>

            <div className="auth-footer mt-4 text-center">
               <Link href="/auth/login" className="auth-link-muted">
                 Batal dan kembali ke Login
               </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

// WAJIB: Bungkus dengan Suspense karena menggunakan useSearchParams()
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Memuat data...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}