import "@/css/ui/style.css"; 

interface TierBadgeProps {
  tier: "Platinum" | "Gold" | "Silver" | "Bronze";
}

export function TierBadge({ tier }: TierBadgeProps) {
  return (
    <span className={`tier-badge ${tier.toLowerCase()}`}>
      {tier}
    </span>
  );
}

interface TierRingProps extends TierBadgeProps {
  avatar: string;
  size?: "sm" | "md" | "lg";
}

export function TierRing({ tier, avatar, size = "md" }: TierRingProps) {
  const safeAvatar = avatar || "";
  // Logika deteksi: Jika string berisi "http" atau "/", asumsikan itu link gambar
const isImage = safeAvatar.includes("http") || safeAvatar.includes("/");

  return (
    <div className={`tier-ring-wrapper ${tier?.toLowerCase()} ${size}`}>
      <div className="avatar-inner">
        {isImage ? (
          <img src={avatar} alt="Profile" />
        ) : (
          avatar
        )}
      </div>
    </div>
  );
}