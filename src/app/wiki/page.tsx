"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useManakAI } from "@/hooks/useManakAI";
import {
    Library,
    Search,
    ExternalLink,
    Send,
    Bot,
    User,
    X,
    Calendar,
    Tag,
} from "lucide-react";

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
}

const CHAT_RESPONSES: Record<string, string> = {
    "is 15700": "IS 15700:2018 establishes quality management requirements for educational organizations. Key clauses include safety infrastructure (5.2), emergency procedures (7.4), accessibility (9.1), and periodic audits (10.3).",
    "ai sutra": "India AI Sutra 2026 is India's comprehensive framework for responsible AI in public institutions. It mandates AI Impact Assessments (3.1), indigenous language support (4.2), bias detection (5.3), data sovereignty (6.1), and grievance redressal (7.4).",
    "iso 42001": "ISO 42001:2023 is the international standard for AI Management Systems. It requires risk assessment frameworks (6.1), transparency (7.2), data governance (8.4), and continuous monitoring (10.1).",
    default: "I can help you understand BIS standards and compliance requirements. Try asking about specific standards like IS 15700, ISO 42001, or India AI Sutra 2026.",
};

export default function WikiPage() {
    const data = useManakAI();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStandard, setSelectedStandard] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { id: "init", role: "assistant", content: "Welcome to the BIS Knowledge Base. Ask me about any Indian Standard or compliance framework." },
    ]);
    const [chatInput, setChatInput] = useState("");

    const filteredStandards = data.bisStandards.filter(
        (s) =>
            s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedData = data.bisStandards.find((s) => s.id === selectedStandard);

    const handleSendChat = () => {
        if (!chatInput.trim()) return;
        const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: chatInput };
        setChatMessages((prev) => [...prev, userMsg]);

        const lowerInput = chatInput.toLowerCase();
        let response = CHAT_RESPONSES.default;
        for (const [key, val] of Object.entries(CHAT_RESPONSES)) {
            if (key !== "default" && lowerInput.includes(key)) {
                response = val;
                break;
            }
        }

        setTimeout(() => {
            const botMsg: ChatMessage = { id: `b-${Date.now()}`, role: "assistant", content: response };
            setChatMessages((prev) => [...prev, botMsg]);
        }, 800);

        setChatInput("");
    };

    return (
        <div className="p-6 flex flex-col h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Library className="w-6 h-6 text-[#D4AF37]" />
                    Standards Wiki
                </h1>
                <p className="text-white/40 text-sm mt-0.5">
                    RAG-powered BIS knowledge base for institutional compliance
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
                                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">{std.category}</span>
                                    <h3 className="text-sm font-bold mt-0.5">{std.code}</h3>
                                </div>
                                <ExternalLink className="w-4 h-4 text-white/20 shrink-0" />
                            </div>
                            <p className="text-xs text-white/50 mb-3">{std.title}</p>
                            <div className="flex items-center gap-3 text-[10px] text-white/25">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {std.lastUpdated}</span>
                                <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {std.mandatoryRequirements.length} requirements</span>
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
                                <h2 className="text-lg font-bold mt-1 mb-1">{selectedData.code}</h2>
                                <p className="text-xs text-white/50 mb-4">{selectedData.description}</p>
                                <h4 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.12em] mb-3">Mandatory Requirements</h4>
                                <div className="space-y-2">
                                    {selectedData.mandatoryRequirements.map((req, i) => (
                                        <div key={i} className="flex items-start gap-2 p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                                            <span className="text-[#D4AF37] text-xs font-bold mt-0.5">{i + 1}.</span>
                                            <span className="text-xs text-white/60 leading-relaxed">{req}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 flex-1 flex items-center justify-center">
                                <p className="text-white/20 text-sm text-center">Select a standard to view details</p>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Ask the Auditor Chat */}
                    <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl flex flex-col h-[280px] shrink-0 overflow-hidden">
                        <div className="p-3 border-b border-white/[0.06] flex items-center gap-2">
                            <Bot className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-xs font-bold">Ask the Auditor</span>
                            <span className="text-[9px] text-emerald-400 ml-auto font-semibold">ONLINE</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                            {chatMessages.map((msg) => (
                                <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                                    {msg.role === "assistant" && <Bot className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />}
                                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-[11px] leading-relaxed ${msg.role === "user"
                                            ? "bg-[#D4AF37]/20 text-white/80"
                                            : "bg-white/[0.05] text-white/60"
                                        }`}>
                                        {msg.content}
                                    </div>
                                    {msg.role === "user" && <User className="w-4 h-4 text-white/30 shrink-0 mt-1" />}
                                </div>
                            ))}
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
