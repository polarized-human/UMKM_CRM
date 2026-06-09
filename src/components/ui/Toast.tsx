import { useEffect } from "react";
import { Check, X } from "lucide-react";
import "@/css/ui/style.css"; 

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  
  // Mesin waktu: Jika toast muncul, hitung 3 detik lalu panggil onClose()
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      // Bersihkan timer untuk mencegah memori bocor (memory leak)
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="toast-container">
      <div className="toast-item">
        <div className={`toast-icon ${type}`}>
          {type === "success" ? <Check size={16} /> : <X size={16} />}
        </div>
        <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>{message}</p>
      </div>
    </div>
  );
}