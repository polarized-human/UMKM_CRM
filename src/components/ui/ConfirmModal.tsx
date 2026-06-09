import "@/css/ui/style.css"; 

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  type = "warning",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-desc">{message}</p>
        
        <div className="modal-actions">
          <button onClick={onCancel} className="btn-modal-cancel">
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className={type === "danger" ? "btn-modal-danger" : "btn-modal-confirm"}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}