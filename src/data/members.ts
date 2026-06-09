export type Tier = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  points: number;
  type: "earn" | "redeem";
  description: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  birth_date?: string;
  joinDate: string;
  lastVisit: string;
  tier: Tier;
  points: number;
  totalSpend: number;
  avatar: string;
  transactions: Transaction[];
}

export const members: Member[] = [
  {
    id: "MBR-001",
    name: "Siti Rahayu",
    phone: "08123456789",
    email: "siti.rahayu@email.com",
    birthDate: "1990-05-26",
    joinDate: "2023-01-15",
    lastVisit: "2024-05-20",
    tier: "Gold",
    points: 4250,
    totalSpend: 3200000,
    avatar: "SR",
    transactions: [
      { id: "TRX-001", date: "2024-05-20", amount: 350000, points: 350, type: "earn", description: "Pembelian Produk Kecantikan" },
      { id: "TRX-002", date: "2024-05-10", amount: 0, points: -500, type: "redeem", description: "Redeem: Diskon 50rb" },
      { id: "TRX-003", date: "2024-04-28", amount: 180000, points: 180, type: "earn", description: "Pembelian Skincare" },
      { id: "TRX-004", date: "2024-04-15", amount: 420000, points: 420, type: "earn", description: "Pembelian Paket Lebaran" },
    ],
  },
  {
    id: "MBR-002",
    name: "Budi Santoso",
    phone: "08234567890",
    email: "budi.s@email.com",
    birthDate: "1985-08-12",
    joinDate: "2022-11-03",
    lastVisit: "2024-05-22",
    tier: "Platinum",
    points: 12800,
    totalSpend: 8500000,
    avatar: "BS",
    transactions: [
      { id: "TRX-005", date: "2024-05-22", amount: 750000, points: 1500, type: "earn", description: "Pembelian Elektronik" },
      { id: "TRX-006", date: "2024-05-01", amount: 0, points: -2000, type: "redeem", description: "Redeem: Hadiah Gratis" },
      { id: "TRX-007", date: "2024-04-20", amount: 650000, points: 1300, type: "earn", description: "Pembelian Bulanan" },
    ],
  },
  {
    id: "MBR-003",
    name: "Dewi Kusuma",
    phone: "08345678901",
    email: "dewi.k@email.com",
    birthDate: "1995-12-03",
    joinDate: "2024-01-20",
    lastVisit: "2024-05-18",
    tier: "Silver",
    points: 1850,
    totalSpend: 950000,
    avatar: "DK",
    transactions: [
      { id: "TRX-008", date: "2024-05-18", amount: 120000, points: 120, type: "earn", description: "Pembelian Mingguan" },
      { id: "TRX-009", date: "2024-05-05", amount: 85000, points: 85, type: "earn", description: "Pembelian Snack" },
    ],
  },
  {
    id: "MBR-004",
    name: "Ahmad Fauzi",
    phone: "08456789012",
    email: "ahmad.f@email.com",
    birthDate: "1988-03-19",
    joinDate: "2023-06-10",
    lastVisit: "2024-04-30",
    tier: "Bronze",
    points: 340,
    totalSpend: 280000,
    avatar: "AF",
    transactions: [
      { id: "TRX-010", date: "2024-04-30", amount: 95000, points: 95, type: "earn", description: "Pembelian Kebutuhan Harian" },
    ],
  },
  {
    id: "MBR-005",
    name: "Rina Marlina",
    phone: "08567890123",
    email: "rina.m@email.com",
    birthDate: "1992-07-07",
    joinDate: "2023-03-22",
    lastVisit: "2024-05-24",
    tier: "Gold",
    points: 5670,
    totalSpend: 2800000,
    avatar: "RM",
    transactions: [
      { id: "TRX-011", date: "2024-05-24", amount: 450000, points: 450, type: "earn", description: "Pembelian Fashion" },
      { id: "TRX-012", date: "2024-05-12", amount: 0, points: -1000, type: "redeem", description: "Redeem: Voucher 100rb" },
      { id: "TRX-013", date: "2024-04-28", amount: 320000, points: 320, type: "earn", description: "Pembelian Aksesoris" },
    ],
  },
  {
    id: "MBR-006",
    name: "Hendra Wijaya",
    phone: "08678901234",
    email: "hendra.w@email.com",
    birthDate: "1980-11-30",
    joinDate: "2022-08-15",
    lastVisit: "2024-05-15",
    tier: "Silver",
    points: 2100,
    totalSpend: 1200000,
    avatar: "HW",
    transactions: [
      { id: "TRX-014", date: "2024-05-15", amount: 200000, points: 200, type: "earn", description: "Pembelian Bulanan" },
      { id: "TRX-015", date: "2024-04-20", amount: 150000, points: 150, type: "earn", description: "Pembelian Mingguan" },
    ],
  },
];