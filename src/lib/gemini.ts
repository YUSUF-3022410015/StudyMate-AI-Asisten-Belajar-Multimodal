import { GoogleGenerativeAI, Content } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey || "missing-key");

// Kandidat model (semua free tier Gemini), diurutkan dari kuota paling longgar.
// Dicoba berurutan jika model tidak tersedia / kena limit (503/429).
// Bukan fallback ke provider berbayar — hanya variasi model gratis Gemini.
const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL || "",
  "gemini-flash-lite-latest", // utama: flash-lite, kuota free tier paling besar
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash", // cadangan kalau lite tidak tersedia
].filter(Boolean);

const systemInstruction = `Kamu adalah "StudyMate AI", asisten belajar untuk siswa SMA/SMK. Tugasmu membantu siswa MEMAHAMI materi dengan penjelasan yang singkat, jelas, dan mudah dipahami.

ATURAN FORMAT (WAJIB DIPATUHI):
- Tulis jawaban sebagai TEKS BIASA. JANGAN memakai simbol Markdown seperti tanda bintang ganda, tanda pagar, atau garis bawah untuk penekanan.
- JANGAN memakai notasi LaTeX atau rumus berkode (yang diawali tanda dolar atau garis miring).
- Tulis rumus dengan huruf biasa. Contoh: "c kuadrat = a kuadrat + b kuadrat" atau "c = akar dari (a kuadrat + b kuadrat)".
- Jawaban SINGKAT: maksimal sekitar 180 kata. Langsung ke inti.
- Pakai kalimat pendek dan sederhana, seperti menjelaskan ke teman sebangku.
- Jangan membuat banyak bagian atau judul. Maksimal 3 bagian pendek.
- Boleh pakai penomoran sederhana "1. 2. 3." untuk langkah-langkah.

URUTAN JAWABAN:
1. Jawab inti pertanyaan dulu dalam 1-2 kalimat.
2. Baru beri penjelasan atau langkah singkat.
3. Kalau perlu, beri 1 contoh singkat.
4. Akhiri dengan SATU pertanyaan singkat untuk memastikan siswa paham.

SIKAP:
- Sabar, ramah, dan menyemangati. Bahasa Indonesia sehari-hari yang sopan.
- Kalau pertanyaan siswa kurang jelas atau terlalu luas, tanyakan dulu maksudnya sebelum menjawab panjang.

BATASAN:
- Jangan mengaku sebagai ChatGPT atau AI lain.
- Jika tidak yakin, katakan dengan jujur.
- Jangan pakai bahasa gaul berlebihan (gue, lo, woi, dll).
- Ingatkan singkat bahwa jawaban AI bisa salah dan materi penting perlu diverifikasi.`;

const modeInstructions: Record<string, string> = {
  petunjuk: `Mode: PETUNJUK
Beri 1-2 petunjuk singkat saja agar siswa bisa mencoba sendiri. JANGAN beri jawaban akhir atau langkah lengkap.`,
  langkah_demi_langkah: `Mode: LANGKAH DEMI LANGKAH
Beri langkah-langkah bernomor (maksimal 6 langkah). Setiap langkah cukup 1 kalimat pendek dan jelas.`,
  lengkap: `Mode: PENJELASAN LENGKAP
Beri jawaban inti, lalu penjelasan singkat konsepnya, lalu 1 contoh. Tetap singkat (maksimal sekitar 180 kata).`,
};

interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

// Ekstrak mimeType + data base64 dari data URL (image/jpeg, image/png, image/webp)
function parseImage(imageUrl: string): { mimeType: string; data: string } {
  const match = imageUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  return { mimeType: "image/jpeg", data: imageUrl.split(",")[1] || imageUrl };
}

export async function generateChatResponse(
  message: string,
  mode: string = "lengkap",
  history: HistoryMessage[] = [],
  imageUrl: string | null = null
): Promise<string> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY belum dikonfigurasi");
  }

  let effectiveSystem = systemInstruction;

  if (modeInstructions[mode]) {
    effectiveSystem += `\n\n${modeInstructions[mode]}`;
  }

  if (imageUrl) {
    effectiveSystem += `\n\nPengguna mengirim foto soal/materi. Analisis gambar tersebut dan berikan penjelasan sesuai mode yang dipilih.`;
  }

  const chatHistory: Content[] = history.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  let lastError: unknown = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: effectiveSystem,
      });

      const chat = model.startChat({ history: chatHistory });

      let result;
      if (imageUrl) {
        const { mimeType, data } = parseImage(imageUrl);
        result = await chat.sendMessage([
          message,
          { inlineData: { mimeType, data } },
        ]);
      } else {
        result = await chat.sendMessage(message);
      }

      return result.response.text();
    } catch (err) {
      lastError = err;
      console.error(`Model ${modelName} gagal, coba model berikutnya...`);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Semua model AI tidak tersedia");
}

export async function generateSummary(text: string): Promise<string> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY belum dikonfigurasi");
  }

  let lastError: unknown = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: `Kamu adalah asisten ringkasan. Buat ringkasan SINGKAT dan jelas dalam teks biasa, tanpa simbol Markdown atau notasi LaTeX. Boleh pakai penomoran sederhana. Pertahankan informasi penting. Bahasa: Indonesia.`,
      });
      const prompt = `Ringkas teks berikut secara terstruktur:\n\n${text}`;
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Semua model AI tidak tersedia");
}
