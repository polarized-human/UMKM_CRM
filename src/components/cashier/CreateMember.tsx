"use client";

import { useState } from "react";
import { Member } from "@/data/members";


interface CreateMemberProps {
  onBack: () => void;
  onSave: (newMember: Member) => void;
}

export default function CreateMember({ onBack, onSave }: CreateMemberProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  
  // UPDATE 1: Tambah state baru untuk menyimpan custom URL Avatar
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // UPDATE 2: Cek apakah input avatar diisi. 
    // Jika ada isinya, pakai URL tersebut. Jika kosong, pakai avatar otomatis.
    const finalAvatar = avatarUrl.trim() !== "" 
      ? avatarUrl 
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    const newMember: Member = {
      id: `MEM-${Date.now().toString().slice(-6)}`,
      name,
      phone,
      email,
      birthDate,
      avatar: finalAvatar, // Gunakan hasil pengecekan di atas
      points: 0,
      totalSpend: 0,
      tier: "Bronze",
      joinDate: new Date().toISOString().split("T")[0],
      lastVisit: new Date().toISOString().split("T")[0],
      transactions: [],
    };

    onSave(newMember);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tambah Member Baru</h2>
        <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
          ✕ Batal
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1a1a24] p-6 rounded-lg max-w-lg border border-gray-800">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">Nama Lengkap</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#0f0f13] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            placeholder="Masukkan nama pelanggan"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">Nomor WhatsApp</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#0f0f13] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            placeholder="Contoh: 08123456789"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">Tanggal Lahir</label>
          <input
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-[#0f0f13] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">Email (Opsional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0f0f13] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            placeholder="email@contoh.com"
          />
        </div>

        {/* UPDATE 3: Form input tambahan khusus untuk foto Avatar */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-300">Link Foto Avatar (Opsional)</label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full bg-[#0f0f13] border border-gray-700 rounded p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
            placeholder="https://contoh.com/foto.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">Kosongkan jika ingin menggunakan avatar otomatis (berdasarkan inisial nama).</p>
        </div>
        
        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded transition-colors shadow-lg shadow-amber-500/20"
        >
          Simpan Member
        </button>
      </form>
    </div>
  );
}