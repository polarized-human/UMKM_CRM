"use client";

import { Sparkles } from "lucide-react";
import { Member } from "@/data/members";
import "@/css/ui/style.css";

interface DigitalCardProps {
  member: Member;
}

export default function DigitalCard({ member }: DigitalCardProps) {
  // Menentukan warna background berdasarkan tier
  const tierClass = `card-bg-${member.tier.toLowerCase()}`;
  
  // QR Code berisi ID member agar bisa di-scan oleh kasir saat kunjungan berikutnya
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${member.id}&bgcolor=ffffff`;

  return (
    <div className={`digital-card ${tierClass}`}>
      <div className="card-top">
        <div className="card-logo">
          <Sparkles size={18} color="white" />
          LoyaltiKu
        </div>
        <div className="card-tier">{member.tier}</div>
      </div>
      
      <div className="card-bottom">
        <div className="card-user-info">
          <div className="card-name">{member.name}</div>
          <div className="card-id">{member.id}</div>
        </div>
        <div className="card-qr">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrUrl} alt={`QR ${member.id}`} />
        </div>
      </div>
    </div>
  );
}