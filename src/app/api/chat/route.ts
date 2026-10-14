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

    const { message, mode, conversationId, imageUrl } = await request.json();

    if (!message && !imageUrl) {
      return NextResponse.json(
        { error: "Pertanyaan atau foto harus diisi" },
        { status: 400 }
      );
    }

    const { getDB } = await import("@/lib/idb");
    const db = await getDB();

    let history: { role: "user" | "assistant"; content: string }[] = [];
    if (conversationId) {
      const conversation = await db.get("conversations", conversationId);
      if (conversation && conversation.messages) {
        history = conversation.messages.slice(-20).map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }));
      }
    }

    const aiResponse = await generateChatResponse(message, mode, history, imageUrl);

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
