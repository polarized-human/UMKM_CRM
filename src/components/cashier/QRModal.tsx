"use client";

import { useEffect, useState } from "react";
import { X, QrCode } from "lucide-react";
import "@/css/cashier/components.css";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string; // ID toko/user yang sedang login
}

export default function QRModal({ isOpen, onClose, storeId }: QRModalProps) {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    // Generate link pendaftaran otomatis berdasarkan domain saat ini
    if (typeof window !== "undefined") {
      const joinLink = `${window.location.origin}/join/${storeId}`;
      // Menggunakan API pihak ketiga gratis untuk generate gambar QR
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(joinLink)}&bgcolor=ffffff`);
    }
  }, [storeId]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 className="modal-title" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <QrCode size={18} color="#fbbf24" /> QR Pendaftaran
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", marginBottom: "1.5rem" }}>
          Minta pelanggan untuk memindai kode QR ini menggunakan kamera HP mereka.
        </p>

        <div style={{ background: "white", padding: "1rem", borderRadius: "1rem", display: "inline-block", marginBottom: "1.5rem" }}>
          {qrUrl ? (
            <img src={qrUrl} alt="QR Code Pendaftaran" style={{ width: "200px", height: "200px" }} />
          ) : (
            <div style={{ width: "200px", height: "200px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#9ca3af" }}>Memuat QR...</span>
            </div>
          )}
        </div>

        <button onClick={onClose} className="btn-modal-cancel" style={{ width: "100%" }}>
          Tutup Layar
        </button>
      </div>
    </div>
  );
}