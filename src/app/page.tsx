import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, FileImage, ListOrdered, Lightbulb, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">StudyMate AI</span>
          </div>
          <Link href="/chat">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Mulai Belajar
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
            <BookOpen className="h-4 w-4" />
            Asisten Belajar Multimodal untuk Siswa
          </div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            StudyMate
            <span className="text-emerald-600"> AI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Belajar jadi lebih mudah. Tanya lewat teks atau upload foto soal,
            pilih mode penjelasan yang kamu butuhkan. Tanpa login, gratis.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/chat">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Mulai Belajar Sekarang
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            Tanpa registrasi. Riwayat tersimpan lokal di browser kamu.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <Lightbulb className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mode Petunjuk</h3>
            <p className="text-gray-600">
              AI memberi arahan awal tanpa langsung membocorkan jawaban. Cocok untuk latihan berpikir.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <ListOrdered className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Langkah demi Langkah</h3>
            <p className="text-gray-600">
              AI menguraikan proses penyelesaian secara runtut, langkah demi langkah yang mudah dipahami.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <FileImage className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analisis Foto Soal</h3>
            <p className="text-gray-600">
              Upload foto soal atau materi (JPEG, PNG, WebP), AI akan membaca dan menjelaskannya.
            </p>
          </div>
        </div>

        <div className="mt-24 text-center text-gray-500 text-sm">
          <p>StudyMate AI — Asisten Belajar Multimodal</p>
          <p className="mt-1">Powered by Google Gemini AI | Riwayat lokal IndexedDB</p>
        </div>
      </main>
    </div>
  );
}
