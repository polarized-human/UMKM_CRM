export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: "diskon" | "hadiah" | "cashback" | "layanan";
  minTier: "Bronze" | "Silver" | "Gold" | "Platinum";
  icon: string;
  stock: number;
  value: string;
}

export const rewards: Reward[] = [
  {
    id: "RWD-001",
    name: "Diskon 10%",
    description: "Potongan 10% untuk pembelian berikutnya, max Rp 50.000",
    pointsCost: 500,
    category: "diskon",
    minTier: "Bronze",
    icon: "🏷️",
    stock: 100,
    value: "Diskon 10%",
  },
  {
    id: "RWD-002",
    name: "Voucher Rp 50.000",
    description: "Voucher belanja senilai Rp 50.000 untuk transaksi min. Rp 200.000",
    pointsCost: 1000,
    category: "cashback",
    minTier: "Silver",
    icon: "💰",
    stock: 50,
    value: "Rp 50.000",
  },
  {
    id: "RWD-003",
    name: "Gratis Ongkir",
    description: "Gratis ongkos kirim untuk 1x pembelian online",
    pointsCost: 750,
    category: "layanan",
    minTier: "Bronze",
    icon: "🚚",
    stock: 200,
    value: "Gratis Ongkir",
  },
  {
    id: "RWD-004",
    name: "Voucher Rp 150.000",
    description: "Voucher belanja senilai Rp 150.000 untuk transaksi min. Rp 500.000",
    pointsCost: 2500,
    category: "cashback",
    minTier: "Gold",
    icon: "🎁",
    stock: 30,
    value: "Rp 150.000",
  },
  {
    id: "RWD-005",
    name: "Produk Gratis",
    description: "Tukar poin dengan produk pilihan senilai hingga Rp 200.000",
    pointsCost: 4000,
    category: "hadiah",
    minTier: "Gold",
    icon: "🎀",
    stock: 20,
    value: "s/d Rp 200.000",
  },
  {
    id: "RWD-006",
    name: "Diskon 25% Premium",
    description: "Potongan 25% tanpa batas maksimum untuk member Platinum",
    pointsCost: 3000,
    category: "diskon",
    minTier: "Platinum",
    icon: "⭐",
    stock: 15,
    value: "Diskon 25%",
  },
  {
    id: "RWD-007",
    name: "Early Access Sale",
    description: "Akses 24 jam lebih awal untuk flash sale eksklusif",
    pointsCost: 1500,
    category: "layanan",
    minTier: "Silver",
    icon: "⚡",
    stock: 75,
    value: "Early Access",
  },
  {
    id: "RWD-008",
    name: "Birthday Special Pack",
    description: "Paket hadiah spesial ulang tahun senilai Rp 300.000",
    pointsCost: 5000,
    category: "hadiah",
    minTier: "Platinum",
    icon: "🎂",
    stock: 10,
    value: "Rp 300.000",
  },
];