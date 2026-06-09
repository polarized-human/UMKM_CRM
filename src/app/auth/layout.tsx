import "@/app/globals.css"; // Tetap pertahankan import CSS ini

export const metadata = {
  title: "Autentikasi - LoyaltiKu",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // HAPUS <html> dan <body>, ganti dengan <> (Fragment)
  return (
    <>
      {children}
    </>
  );
}