import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StudyMate AI — Asisten Belajar Multimodal",
  description: "Asisten belajar berbasis AI untuk membantu siswa SMA/SMK memahami materi dan soal melalui teks maupun gambar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
