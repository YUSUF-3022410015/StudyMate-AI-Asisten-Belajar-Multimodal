import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Layanan AI belum dikonfigurasi. Hubungi pengembang." },
        { status: 500 }
      );
    }

    const { message, mode, history = [], imageUrl } = await request.json();

    if (!message && !imageUrl) {
      return NextResponse.json(
        { error: "Pertanyaan atau foto harus diisi" },
        { status: 400 }
      );
    }

    // History dikirim dari client (browser) karena IndexedDB hanya ada di browser
    const trimmedHistory = (Array.isArray(history) ? history : [])
      .slice(-20)
      .map((msg: { role: "user" | "assistant"; content: string }) => ({
        role: msg.role,
        content: msg.content,
      }));

    const aiResponse = await generateChatResponse(message, mode, trimmedHistory, imageUrl);

    return NextResponse.json({ response: aiResponse });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan";
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}
