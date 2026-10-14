import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/gemini";

// Batas input (validasi server-side - UI bukan satu-satunya perlindungan, PRD 10.4)
const MAX_MESSAGE_LENGTH = 8000; // karakter
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VALID_MODES = ["petunjuk", "langkah_demi_langkah", "lengkap"];

// Rate limit best-effort (in-memory). PENTING: pada serverless ini TIDAK global
// (instans bisa terpisah). Untuk produksi sebaiknya pakai penyimpanan terdistribusi
// (mis. Upstash Redis free tier). Ini hanya lapisan pertama, bukan satu-satunya proteksi.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12; // permintaan per menit per IP
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) return false;
  bucket.count += 1;
  return true;
}

// Validasi data URL gambar: format + tipe + estimasi ukuran byte
function parseImageDataUrl(imageUrl: string): { mimeType: string; byteLength: number } | null {
  const match = imageUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return null;
  const mimeType = match[1];
  const b64 = match[2];
  const byteLength = Math.floor((b64.length * 3) / 4);
  return { mimeType, byteLength };
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Layanan AI belum dikonfigurasi. Hubungi pengembang." },
        { status: 500 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi." },
        { status: 429 }
      );
    }

    const { message, mode, history = [], imageUrl } = await request.json();

    const text = typeof message === "string" ? message.trim() : "";

    if (!text && !imageUrl) {
      return NextResponse.json(
        { error: "Pertanyaan atau foto harus diisi" },
        { status: 400 }
      );
    }

    if (text.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Pertanyaan terlalu panjang. Maksimal ${MAX_MESSAGE_LENGTH} karakter.` },
        { status: 400 }
      );
    }

    if (imageUrl) {
      if (typeof imageUrl !== "string") {
        return NextResponse.json({ error: "Format gambar tidak valid." }, { status: 400 });
      }
      const parsed = parseImageDataUrl(imageUrl);
      if (!parsed) {
        return NextResponse.json(
          { error: "Format gambar tidak valid. Gunakan JPEG, PNG, atau WebP." },
          { status: 400 }
        );
      }
      if (!ALLOWED_IMAGE_TYPES.includes(parsed.mimeType)) {
        return NextResponse.json(
          { error: "Tipe gambar tidak didukung. Gunakan JPEG, PNG, atau WebP." },
          { status: 400 }
        );
      }
      if (parsed.byteLength > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: "Ukuran gambar terlalu besar. Maksimal 10 MB." },
          { status: 400 }
        );
      }
    }

    const safeMode = VALID_MODES.includes(mode) ? mode : "lengkap";

    const trimmedHistory = (Array.isArray(history) ? history : [])
      .slice(-20)
      .filter((msg) => msg && typeof msg.content === "string")
      .map((msg: { role: "user" | "assistant"; content: string }) => ({
        role: msg.role,
        content: msg.content,
      }));

    const aiResponse = await generateChatResponse(text, safeMode, trimmedHistory, imageUrl || null);

    return NextResponse.json({ response: aiResponse });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    // Pesan aman: jangan bocorkan stack trace / detail internal (FR-08)
    const raw = error instanceof Error ? error.message : "";
    let userMsg = "Layanan AI sedang bermasalah. Silakan coba lagi nanti.";
    if (/429|quota|rate limit|RESOURCE_EXHAUSTED|exceeded/i.test(raw)) {
      userMsg = "Layanan AI sedang mencapai batas penggunaan (kuota). Coba lagi nanti.";
    } else if (/503|overload|high demand|UNAVAILABLE|timeout/i.test(raw)) {
      userMsg = "Layanan AI sedang sibuk. Coba lagi sebentar lagi.";
    }
    return NextResponse.json({ error: userMsg }, { status: 500 });
  }
}
