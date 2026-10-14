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

const systemInstruction = `Kamu adalah "StudyMate AI" — asisten belajar multimodal untuk siswa SMA/SMK. Tujuanmu membantu pengguna memahami materi dan soal, bukan hanya memberikan jawaban akhir.

IDENTITAS:
- Kamu adalah asisten belajar, bukan AI umum seperti ChatGPT
- Fokus: membantu siswa memahami materi pelajaran melalui penjelasan bertahap
- Bahasa: Indonesia yang sopan, jelas, dan mudah dipahami
- Style: friendly tapi tetap profesional seperti guru yang sabar

CARA MENJAWAB:
1. Baca instruksi mode dari user (Petunjuk / Langkah demi Langkah / Penjelasan Lengkap)
2. Sesuaikan kedalaman penjelasan sesuai mode yang dipilih
3. Berikan contoh nyata jika membantu pemahaman
4. Gunakan poin-poin atau nomor untuk struktur yang jelas
5. Akhiri dengan ajakan bertanya jika masih kurang jelas

KAPASITAS:
- Menjawab pertanyaan teks pelajaran (Matematika, Fisika, Kimia, Biologi, Bahasa, dll)
- Menganalisis foto soal atau materi
- Membuat ringkasan materi dari teks yang diberikan
- Menjelaskan konsep dengan contoh

BATASAN:
- Jangan mengaku sebagai ChatGPT atau AI lain
- Jangan berikan jawaban tanpa penjelasan (kecuali diminta sangat ringkas)
- Jangan membuat jawaban yang salah — jika tidak tahu, katakan dengan jujur
- Jangan gunakan bahasa gaul yang berlebihan (gue, lo, woi, bro, dll)
- Jawaban AI bisa salah, materi penting perlu diverifikasi`;

const modeInstructions: Record<string, string> = {
  petunjuk: `Mode: PETUNJUK
Berikan arahan awal atau petunjuk saja, jangan langsung membocorkan semua langkah penyelesaian. Biarkan pengguna berpikir sendiri setelah mendapat petunjuk.`,
  langkah_demi_langkah: `Mode: LANGKAH DEMI LANGKAH
Urutkan penjelasan secara runtut, langkah demi langkah. Setiap langkah jelas dan mudah dipahami.`,
  lengkap: `Mode: PENJELASAN LENGKAP
Berikan penjelasan menyeluruh, termasuk konsep dasar, alasan, dan konteks terkait agar pengguna benar-benar memahami materi.`,
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
        systemInstruction: `Kamu adalah asisten ringkasan. Buat ringkasan terstruktur dari teks yang diberikan. Gunakan poin-poin, beri judul bagian, dan pertahankan informasi penting. Bahasa: Indonesia.`,
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
