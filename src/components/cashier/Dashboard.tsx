"use client";

import { Member } from "@/data/members";
import { TierBadge, TierRing } from "@/components/ui/TierBadge";
import { Users, TrendingUp, Star, Gift, Bell, ShoppingBag, CreditCard, Cake, MessageCircle } from "lucide-react";

interface DashboardProps {
  members: Member[];
  onSelectMember: (member: Member) => void;
  onOpenTransaction: (member: Member) => void;
  user?: any;
}

function formatRupiah(amount: number) {
  if (isNaN(amount)) return "Rp0";
  if (amount >= 1000000) return `Rp${(amount / 1000000).toFixed(1)}jt`;
  if (amount >= 1000) return `Rp${(amount / 1000).toFixed(0)}rb`;
  return `Rp${amount}`;
}

function getUpcomingBirthdays(members: Member[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset jam agar hitungan hari akurat

  return members
    .map((m) => {
      // 1. Ambil tanggal dari format API Laravel ATAU format React lokal
      const dateString = m.birth_date || m.birthDate;

      // 2. Jika member tidak punya data tanggal lahir, lewati (beri nilai 999 hari)
      if (!dateString) {
        return { ...m, daysUntil: 999 };
      }

      const bd = new Date(dateString);
      
      // 3. Set target ulang tahun ke tahun ini
      let next = new Date(today.getFullYear(), bd.getMonth(), bd.getDate());
      
      // 4. Jika bulan/tanggal ultah sudah lewat tahun ini, targetkan ke tahun depan
      if (next.getTime() < today.getTime()) {
        next = new Date(today.getFullYear() + 1, bd.getMonth(), bd.getDate());
      }
      
      // 5. Hitung selisih hari
      const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { ...m, daysUntil: diff };
    })
    // 6. Filter hanya yang ultahnya kurang dari atau sama dengan 30 hari
    .filter((m) => m.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

function getWhatsappLink(member: Member & { daysUntil: number }) {
  const msg = encodeURIComponent(`Halo ${member.name}! 🎂 Selamat Ulang Tahun dari kami! Sebagai hadiah spesial, kamu mendapatkan bonus 500 poin hari ini. Jangan lupa kunjungi toko kami! 🎁`);
  return `https://wa.me/${member.phone.replace(/^0/, "62")}?text=${msg}`;
}

export default function Dashboard({ members, onSelectMember, onOpenTransaction, user }: DashboardProps) {
  const totalPoints = members.reduce((s, m) => s + Number(m.points || 0), 0);
  const totalRevenue = members.reduce((s, m) => s + Number(m.totalSpend || 0), 0);
  const birthdays = getUpcomingBirthdays(members);
  const tierCounts = members.reduce((acc, m) => ({ ...acc, [m.tier]: (acc[m.tier] || 0) + 1 }), {} as Record<string, number>);
  const recentMembers = [...members].sort((a, b) => b.lastVisit.localeCompare(a.lastVisit)).slice(0, 5);

  const stats = [
    { label: "Total Member", value: members.length.toString(), sub: "+3 bulan ini", icon: Users, grad: "grad-blue" },
    { label: "Total Revenue", value: formatRupiah(totalRevenue), sub: "semua transaksi", icon: TrendingUp, grad: "grad-emerald" },
    { label: "Total Poin Aktif", value: totalPoints.toLocaleString(), sub: "belum diredeem", icon: Star, grad: "grad-amber" },
    { label: "Ulang Tahun", value: birthdays.length.toString(), sub: "dalam 30 hari", icon: Cake, grad: "grad-rose" },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header-flex">
        <div>
          {/* 3. Tampilkan nama user */}
          <h2 className="page-title">Halo, {user ? user.name : "Kasir"} 👋</h2>
          <p className="page-subtitle">Pantau loyalitas pelanggan UMKM Anda</p>
        </div>
        <div className="text-right">
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>Hari ini</p>
          <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map(({ label, value, sub, icon: Icon, grad }) => (
          <div key={label} className="stat-card">
            <div className={`stat-icon ${grad}`}><Icon size={18} color="white" /></div>
            <p className="stat-value">{value}</p>
            <p className="stat-label">{label}</p>
            <p className="stat-sub">{sub}</p>
          </div>
        ))}
      </div>

      <div className="dash-grid-3">
        {/* Birthday Reminders */}
        <div className="panel-card col-span-1">
          <div className="panel-header">
            <div className="panel-title"><Bell size={15} color="#fb7185" /> Reminder Ulang Tahun</div>
            <span className="badge-rose">{birthdays.length} member</span>
          </div>
          <div className="scroll-area">
            {birthdays.length === 0 ? (
              <p style={{ textAlign: "center", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", padding: "2rem 0" }}>Tidak ada ulang tahun dalam 30 hari</p>
            ) : (
              birthdays.map((m) => (
                <div key={m.id} className="reminder-item">
                  <div className="avatar-sm grad-rose">{m.avatar}</div>
                  <div className="flex-1">
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "white" }} className="text-truncate">{m.name}</p>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>{m.daysUntil === 0 ? "🎂 Hari ini!" : `${m.daysUntil} hari lagi`}</p>
                  </div>
                  <a href={getWhatsappLink(m)} target="_blank" rel="noopener noreferrer" className="btn-icon" title="Kirim WhatsApp">
                    <MessageCircle size={13} color="#34d399" />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="panel-card col-span-2">
          <div className="panel-header">
            <div className="panel-title"><ShoppingBag size={15} color="#fbbf24" /> Member Terbaru Aktif</div>
          </div>
          <div className="activity-list">
            {recentMembers.map((m) => (
              <div key={m.id} className="activity-item" onClick={() => onSelectMember(m)}>
                <TierRing tier={m.tier} avatar={m.avatar} size="sm" />
                <div className="flex-1">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "white" }} className="text-truncate">{m.name}</p>
                    <TierBadge tier={m.tier} />
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>Kunjungan: {new Date(m.lastVisit).toLocaleDateString("id-ID")}</p>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fbbf24" }}>{Number(m.points || 0).toLocaleString()} pts</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>{formatRupiah(Number(m.totalSpend || 0))}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onOpenTransaction(m); }} className="btn-transaction">
                  <CreditCard size={12} /> Transaksi
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tier Distribution */}
      <div className="panel-card" style={{ padding: "1.25rem" }}>
        <h3 className="panel-title" style={{ marginBottom: "1rem" }}><Gift size={15} color="#a78bfa" /> Distribusi Tier Member</h3>
        <div className="tier-grid">
          {[
            { tier: "Platinum", grad: "grad-violet" },
            { tier: "Gold", grad: "grad-gold" },
            { tier: "Silver", grad: "grad-silver" },
            { tier: "Bronze", grad: "grad-bronze" },
          ].map(({ tier, grad }) => {
            const count = tierCounts[tier] || 0;
            const pct = members.length ? Math.round((count / members.length) * 100) : 0;
            return (
              <div key={tier}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>{tier}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "white" }}>{count}</span>
                </div>
                <div className="tier-progress-bg">
                  <div className={`tier-progress-fill ${grad}`} style={{ width: `${pct}%` }} />
                </div>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}