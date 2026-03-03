"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { T } from "@/components/TranslatedText";
import { useManakAI } from "@/hooks/useManakAI";
import {
    Search,
    ExternalLink,
    Send,
    Bot,
    User,
    X,
    Loader2,
    BookOpen,
    MessageSquare
} from "lucide-react";

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: { standardCode: string; section: string }[];
}

export default function WikiPage() {
    const data = useManakAI();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStandard, setSelectedStandard] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { id: "init", role: "assistant", content: "Welcome to the BIS Knowledge Base. I'm powered by Gemini AI with RAG retrieval over BIS standards. Ask me anything!" },
    ]);
    const [chatInput, setChatInput] = useState("");
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const filteredStandards = data.bisStandards.filter(
        (s) =>
            s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedData = data.bisStandards.find((s) => s.id === selectedStandard);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    const handleSendChat = async () => {
        if (!chatInput.trim() || isChatLoading) return;
        const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: chatInput };
        setChatMessages((prev) => [...prev, userMsg]);
        setChatInput("");
        setIsChatLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: chatInput }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            const botMsg: ChatMessage = {
                id: `b-${Date.now()}`,
                role: "assistant",
                content: data.response,
                sources: data.sources,
            };
            setChatMessages((prev) => [...prev, botMsg]);
        } catch {
            setChatMessages((prev) => [
                ...prev,
                { id: `e-${Date.now()}`, role: "assistant", content: "Sorry, I encountered an error. Please try again." },
            ]);
        } finally {
            setIsChatLoading(false);
        }
    };

    return (
        <div className="p-6 flex flex-col h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[#D4AF37]" />
                    <T>Standards Wiki</T>
                </h1>
                <p className="text-white/40 text-sm mt-0.5">
                    <T>RAG-powered BIS knowledge base for institutional compliance</T>
                </p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                    type="text"
                    placeholder="Search standards (IS 15700, ISO 42001, India AI Sutra...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#D4AF37]/40 transition"
                />
            </div>

            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                {/* Standards Grid */}
                <div className="col-span-12 lg:col-span-7 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                    {filteredStandards.map((std, i) => (
                        <motion.div
                            key={std.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelectedStandard(std.id)}
                            className={`p-5 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${selectedStandard === std.id
                                ? "bg-[#D4AF37]/10 border-[#D4AF37]/30"
                                : "bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]"
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-bold text-[#D4AF37]">{std.id}</h3>
                                    <p className="text-sm text-white/60 mt-1 line-clamp-2">{std.title}</p>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40">{std.category}</span>
                                        <span className="text-[10px] text-[#D4AF37]/60">{std.mandatoryRequirements.length} <T>requirements</T></span>
                                    </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-white/20 shrink-0" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Right Panel: Detail + Chat */}
                <div className="col-span-12 lg:col-span-5 flex flex-col min-h-0 gap-4">
                    {/* Detail Panel */}
                    <AnimatePresence mode="wait">
                        {selectedData ? (
                            <motion.div
                                key={selectedData.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 flex-1 overflow-y-auto custom-scrollbar relative"
                            >
                                <button
                                    onClick={() => setSelectedStandard(null)}
                                    className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">{selectedData.category}</span>
                                <h2 className="text-xl font-bold">{selectedData.id}</h2>
                                <p className="text-white/60 mt-2">{selectedData.title}</p>
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <h3 className="font-bold text-[#D4AF37] text-sm mb-3"><T>Mandatory Requirements</T></h3>
                                    <div className="space-y-2">
                                        {selectedData.mandatoryRequirements.map((req, i) => (
                                            <div key={i} className="flex items-start gap-2 p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                                                <span className="text-[#D4AF37] text-xs font-bold mt-0.5">{i + 1}.</span>
                                                <span className="text-xs text-white/60 leading-relaxed">{req}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 flex-1 flex items-center justify-center">
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-8">
                                    <BookOpen className="w-16 h-16 text-white/20 mb-4" />
                                    <h3 className="text-lg font-bold text-white/80"><T>Select a standard to view details</T></h3>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Ask the Auditor Chat */}
                    <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl flex flex-col h-[280px] shrink-0 overflow-hidden">
                        <div className="p-3 border-b border-white/[0.06] flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center border border-[#D4AF37]/30">
                                <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold"><T>Ask the Auditor</T></h2>
                                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> <T>ONLINE</T>
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                            {chatMessages.map((msg) => (
                                <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                                    {msg.role === "assistant" && <Bot className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />}
                                    <div>
                                        <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[11px] leading-relaxed ${msg.role === "user"
                                            ? "bg-[#D4AF37]/20 text-white/80"
                                            : "bg-white/[0.05] text-white/60"
                                            }`}>
                                            {msg.content}
                                        </div>
                                        {msg.sources && msg.sources.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {msg.sources.map((s, i) => (
                                                    <span key={i} className="text-[9px] px-1.5 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37]/70 rounded font-mono">
                                                        {s.standardCode}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {msg.role === "user" && <User className="w-4 h-4 text-white/30 shrink-0 mt-1" />}
                                </div>
                            ))}
                            {isChatLoading && (
                                <div className="flex gap-2">
                                    <Bot className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />
                                    <div className="px-3 py-2 bg-white/[0.05] rounded-xl">
                                        <Loader2 className="w-4 h-4 text-[#D4AF37] animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="p-3 border-t border-white/[0.06] flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                                placeholder="Ask about BIS standards..."
                                className="flex-1 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/40 transition"
                            />
                            <button
                                onClick={handleSendChat}
                                className="px-3 bg-[#D4AF37] text-[#001229] rounded-lg hover:bg-[#e8c84a] transition"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
