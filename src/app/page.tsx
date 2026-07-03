"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles, Users, Star, Gift, MessageCircle, QrCode,
  TrendingUp, ArrowRight, BarChart3, Menu, X, Play
} from "lucide-react";

import "@/css/landing/style.css";

// ==========================================
// STATIC DATA (Di luar komponen agar tidak re-render)
// ==========================================
const NAV_LINKS = ["Fitur", "Cara Kerja", "Harga", "Testimoni"];

const STATS_DATA = [
  { value: 500, suffix: "+", label: "UMKM Aktif", sub: "di Indonesia" },
  { value: 98, suffix: "%", label: "Retensi", sub: "rata-rata pelanggan" },
  { value: 2.4, suffix: "x", label: "Repeat Order", sub: "lebih banyak" },
  { value: 50000, suffix: "+", label: "Member", sub: "kartu aktif" },
];

const FEATURES_DATA = [
  { icon: Users, bg: 'linear-gradient(135deg, #3b82f6, #06b6d4)', title: "Database Member", desc: "Simpan data pelanggan lengkap — nama, kontak, ulang tahun, riwayat belanja." },
  { icon: Star, bg: 'linear-gradient(135deg, #f59e0b, #f97316)', title: "Sistem Poin Otomatis", desc: "Kalkulasi otomatis saat kasir input transaksi. Tidak perlu hitung manual." },
  { icon: QrCode, bg: 'linear-gradient(135deg, #8b5cf6, #c026d3)', title: "Kartu Member Digital", desc: "QR code unik per member. Tampilkan dari HP, scan di kasir." },
  { icon: Gift, bg: 'linear-gradient(135deg, #f43f5e, #db2777)', title: "Katalog Hadiah", desc: "Buat reward menarik — voucher diskon, produk gratis, cashback." },
  { icon: MessageCircle, bg: 'linear-gradient(135deg, #10b981, #14b8a6)', title: "Reminder WhatsApp", desc: "Otomatis notifikasi ulang tahun pelanggan via WhatsApp 1 klik." },
  { icon: BarChart3, bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', title: "Analitik & Tier", desc: "Bronze, Silver, Gold, Platinum naik otomatis sesuai total belanja." },
];

// ==========================================
// SUB-COMPONENTS
// ==========================================
function Counter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(ease * end));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString("id-ID")}{suffix}</span>;
}

// Interface yang lebih baik untuk menggantikan any[]
interface StarType {
  top: string; left: string; size: number; opacity: number; duration: number; delay: number;
}

function StarField({ count = 60 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<StarType[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: count }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.05,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 4,
      }))
    );
    setMounted(true);
  }, [count]);

  if (!mounted) return null;

  return (
    <>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', borderRadius: '50%', background: 'white', pointerEvents: 'none',
            top: s.top, left: s.left, width: s.size, height: s.size, opacity: s.opacity,
            animation: `twinkle ${s.duration}s ease-in-out infinite`, animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </>
  );
}

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing-layout">
      
      {/* ── NAVBAR ── */}
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="nav-logo-box">
              <Sparkles size={15} color="white" />
            </div>
            <span className="font-display font-bold text-lg">LoyaltiKu</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav-links desktop-only">
            {NAV_LINKS.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="nav-link">
                {item}
              </a>
            ))}
          </nav>

          <div className="desktop-only flex items-center gap-4">
            <Link href="/auth/login" className="nav-link font-bold">Masuk</Link>
            <Link href="/auth/register" className="landing-btn landing-btn-primary">
              Mulai Gratis <ArrowRight size={14} />
            </Link>
          </div>

          <button className="mobile-only text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="mobile-menu mobile-only">
            {NAV_LINKS.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} onClick={() => setMenuOpen(false)} className="nav-link">
                {item}
              </a>
            ))}
            <div className="flex gap-2 mt-4">
              <Link href="/auth/login" className="landing-btn landing-btn-outline flex-1">Masuk</Link>
              <Link href="/auth/register" className="landing-btn landing-btn-primary flex-1">Daftar</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <StarField count={50} />

        {/* Ambience Glow */}
        <div className="glow-blob" style={{ background: '#f59e0b', width: '500px', height: '300px', top: '25%', left: '25%' }} />
        <div className="glow-blob" style={{ background: '#f97316', width: '300px', height: '300px', bottom: '20%', right: '20%' }} />

        {/* Floating Widget 1 */}
        <div className="floating-card float-a desktop-only" style={{ top: '25%', left: '5%', minWidth: '220px' }}>
          <p className="text-xs text-muted mb-2 uppercase">Member Baru</p>
          <div className="flex items-center gap-2">
            <div className="floating-avatar">SR</div>
            <div>
              <p className="text-base font-bold">Siti Rahayu</p>
              <p className="text-xs text-muted">Gold Member • 4.250 pts</p>
            </div>
          </div>
        </div>

        {/* Floating Widget 2 */}
        <div className="floating-card float-b desktop-only" style={{ top: '20%', right: '8%', minWidth: '200px' }}>
           <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} color="#34d399" />
              <p className="text-sm font-bold" style={{ color: '#34d399' }}>Transaksi Berhasil</p>
           </div>
           <p className="text-xl font-bold">Rp 350.000</p>
           <p className="text-xs text-muted">+350 poin ditambahkan</p>
        </div>

        {/* Hero Content */}
        <div className="text-center" style={{ zIndex: 10, maxWidth: '800px' }}>
          <div className="hero-badge slide-up-1">
             <div className="hero-badge-dot" />
             Program Loyalitas #1 UMKM
          </div>
          
          <h1 className="font-display hero-title slide-up-2">
            Pelanggan <br />
            <span className="gradient-text">Setia = Bisnis</span> <br />
            Tumbuh
          </h1>
          
          <p className="hero-desc slide-up-3">
            Sistem CRM & loyalitas lengkap untuk UMKM — dari kartu member digital, poin otomatis, sampai reminder ulang tahun via WhatsApp.
          </p>

          <div className="flex justify-center items-center gap-4 flex-wrap slide-up-4">
            <Link href="/auth/register" className="landing-btn landing-btn-primary lg">
              Mulai Gratis Sekarang <ArrowRight size={16} />
            </Link>
            <Link href="/auth/login" className="landing-btn landing-btn-outline lg">
              <Play size={16} color="#fbbf24" fill="currentColor" /> Lihat Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="section border-y">
        <div className="container grid-4 text-center">
          {STATS_DATA.map((stat, i) => (
            <div key={i}>
              <p className="font-display gradient-text text-4xl font-bold">
                <Counter end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="font-bold text-base mt-2">{stat.label}</p>
              <p className="text-sm text-muted">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="fitur" className="section">
        <div className="container">
          <div className="section-header">
             <h2 className="section-title">Fitur Lengkap, <br/><span className="gradient-text">Mudah Digunakan</span></h2>
             <p className="section-subtitle">Dirancang khusus untuk UMKM. Langsung pakai hari ini.</p>
          </div>

          <div className="grid-3">
            {FEATURES_DATA.map((f, i) => (
              <div key={i} className="card">
                <div className="card-icon" style={{ background: f.bg }}>
                  <f.icon color="white" size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-base text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t" style={{ borderColor: 'var(--border-light)', padding: '60px 0 30px' }}>
        <div className="container text-center">
           <div className="flex items-center justify-center gap-2 mb-4">
              <div className="nav-logo-box"><Sparkles size={14} color="white" /></div>
              <span className="font-display font-bold">LoyaltiKu</span>
           </div>
           <p className="text-muted text-base mb-8">Platform CRM & loyalitas pelanggan untuk UMKM Indonesia.</p>
           <p className="text-xs text-muted" style={{ opacity: 0.6 }}>© 2026 LoyaltiKu. Dibuat dengan ❤️ untuk UMKM.</p>
        </div>
      </footer>

    </div>
  );
}