"use client";

import { LayoutDashboard, Users, Gift, LogOut, Sparkles } from "lucide-react";
import { ActiveView } from "@/app/cashier/page";

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  user: any; // Menerima data user yang sedang login
  onLogout: () => void; // Menerima fungsi untuk logout
}

export default function Sidebar({ activeView, setActiveView, user, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "members", label: "Data Member", icon: Users },
    { id: "rewards", label: "Katalog Hadiah", icon: Gift },
  ] as const;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Sparkles size={16} color="white" />
        </div>
        <div>
          {/* Tampilkan Nama Toko dari Database jika ada */}
          <strong style={{ color: "white", fontSize: "1rem", display: "block" }}>
            {user ? user.store_name : "LoyaltiKu"}
          </strong>
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>UMKM CRM</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`nav-item ${activeView === item.id ? "active" : ""}`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {/* Tombol Logout dipasangkan dengan fungsi onLogout */}
        <button className="nav-item" style={{ color: "rgba(239, 68, 68, 0.8)" }} onClick={onLogout}>
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}