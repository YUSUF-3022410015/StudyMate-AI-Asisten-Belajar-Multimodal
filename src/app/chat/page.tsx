"use client";

import { useEffect, useRef, useState } from "react";
import { getDB, getAllConversations, saveConversation, updateConversationMessages, deleteConversation } from "@/lib/idb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, Menu, FileImage, FileText, Plus, MessageSquare, Trash2, X } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState<string>("lengkap");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations from IndexedDB on mount
  useEffect(() => {
    async function load() {
      const all = await getAllConversations();
      setConversations(all);
    }
    load();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    async function loadMessages() {
      if (!activeConversationId) {
        setMessages([]);
        return;
      }
      const db = await getDB();
      const conv = await db.get("conversations", activeConversationId);
      setMessages(conv?.messages || []);
    }
    loadMessages();
  }, [activeConversationId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const reloadConversations = async () => {
    const all = await getAllConversations();
    setConversations(all);
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setSidebarOpen(false);
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Hapus percakapan ini?")) return;
    await deleteConversation(id);
    await reloadConversations();
    if (activeConversationId === id) handleNewChat();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File terlalu besar. Maksimal 10MB.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Format tidak didukung. Gunakan JPEG, PNG, atau WebP.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || sending) return;

    const userMessage = input.trim();
    setInput("");
    setSending(true);

    try {
      // Create conversation if needed
      let convId = activeConversationId;
      if (!convId) {
        convId = Date.now().toString();
        const title = userMessage.length > 30 ? userMessage.substring(0, 30) + "..." : userMessage || "Foto Soal";
        await saveConversation(convId, title, []);
        setActiveConversationId(convId);
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: userMessage,
        timestamp: Date.now(),
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);

      // Prepare image data
      let imageData = null;
      if (selectedFile && imagePreview) {
        imageData = imagePreview;
      }

      // Call API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage || "Analisis foto soal ini dan jelaskan.",
          mode,
          conversationId: convId,
          imageUrl: imageData,
        }),
      });

      const data = await res.json();

      if (data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: Date.now(),
        };
        const finalMessages = [...updatedMessages, aiMessage];
        await updateConversationMessages(convId, finalMessages);
        setMessages(finalMessages);
        await reloadConversations();
      } else if (data.error) {
        const errMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Maaf, terjadi kendala: ${data.error}. Silakan coba lagi.`,
          timestamp: Date.now(),
        };
        const finalMessages = [...updatedMessages, errMsg];
        await updateConversationMessages(convId, finalMessages);
        setMessages(finalMessages);
      }

      if (selectedFile) {
        setSelectedFile(null);
        setImagePreview(null);
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Terjadi kesalahan teknis";
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: `Maaf, terjadi kendala: ${errMsg}. Silakan coba lagi.`, timestamp: Date.now() },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} fixed lg:static inset-y-0 left-0 z-50 w-64 h-full bg-gray-900 text-white flex flex-col transition-transform duration-200 ease-in-out`}
      >
        <div className="p-3 flex items-center justify-between border-b border-gray-700">
          <span className="font-semibold text-sm">Riwayat Belajar</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" /> Percakapan Baru
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {conversations.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-4">Belum ada riwayat</div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer mb-1 transition-colors ${
                  activeConversationId === conv.id ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="truncate text-sm flex-1 min-w-0">{conv.title}</span>
                <button
                  onClick={(e) => handleDeleteConversation(e, conv.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="p-3 border-t border-gray-700 text-xs text-gray-500 text-center">
          Riwayat tersimpan lokal di browser
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 p-3 border-b bg-white">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-gray-900">StudyMate AI</span>
        </div>

        {/* Mode Selector */}
        <div className="bg-gray-50 border-b px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Mode Belajar:</span>
            <div className="flex gap-2">
              {[
                { key: "petunjuk", label: "Petunjuk" },
                { key: "langkah_demi_langkah", label: "Langkah demi Langkah" },
                { key: "lengkap", label: "Penjelasan Lengkap" },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    mode === m.key ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-lg border border-emerald-200 mt-3">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-12 w-12 object-cover rounded" />
              ) : (
                <FileText className="h-5 w-5 text-emerald-600" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-emerald-900 truncate">{selectedFile.name}</p>
                <p className="text-xs text-emerald-700">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={handleRemoveFile} className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded">
                <span className="text-lg">&times;</span>
              </button>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !activeConversationId ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ada yang bisa saya bantu belajar?</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                StudyMate AI — Asisten belajar multimodal untuk siswa SMA/SMK. Tanya lewat teks atau upload foto soal.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {[
                  "Jelaskan konsep fotosintesis",
                  "Bagaimana cara menyelesaikan persamaan kuadrat?",
                  "Buat ringkasan materi pergerakan nasional",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-sm bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full hover:bg-emerald-100 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-emerald-600" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] lg:max-w-[70%] px-4 py-3 rounded-2xl ${
                    msg.role === "user" ? "bg-emerald-600 text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))
          )}

          {sending && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-3 lg:p-4 bg-white">
          <div className="flex gap-2 lg:gap-3 items-end">
            <label className="p-2 text-gray-500 hover:text-emerald-600 cursor-pointer transition-colors">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-8 w-8 object-cover rounded" />
              ) : (
                <FileImage className="h-6 w-6" />
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileSelect} />
            </label>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pertanyaan atau upload foto soal..."
              disabled={sending}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={(!input.trim() && !selectedFile) || sending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center hidden sm:block">
            StudyMate AI — Asisten Belajar Multimodal | Powered by Google Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}
