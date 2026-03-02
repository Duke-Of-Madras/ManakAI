"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Upload,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    BookOpen,
    Zap,
    Brain,
    Target,
} from "lucide-react";

interface AnalysisItem {
    id: string;
    type: "gap" | "compliance" | "upgrade";
    title: string;
    detail: string;
    clause: string;
}

const MOCK_ANALYSIS: AnalysisItem[] = [
    { id: "a1", type: "gap", title: "Missing AI Ethics Module", detail: "Curriculum does not cover responsible AI deployment as mandated by India AI Sutra 2026 (Sutra 5.3).", clause: "India AI Sutra 2026 §5.3" },
    { id: "a2", type: "gap", title: "Insufficient Data Governance Training", detail: "No dedicated coursework on data sovereignty and governance frameworks.", clause: "ISO 42001 Clause 8.4" },
    { id: "a3", type: "compliance", title: "Software Engineering Practices", detail: "Meets BIS quality standards for software development methodology education.", clause: "IS 15700 Clause 10.3" },
    { id: "a4", type: "compliance", title: "Mathematics Foundation", detail: "Strong alignment with prerequisite standards for AI/ML coursework.", clause: "IS 15700 Clause 4.2" },
    { id: "a5", type: "upgrade", title: "Add NPU/Edge Computing Lab", detail: "Recommend adding dedicated Neural Processing Unit (NPU) coursework to align with India's AI hardware strategy.", clause: "India AI Sutra 2026 §3.1" },
    { id: "a6", type: "upgrade", title: "Indigenous Language NLP Module", detail: "Add a dedicated module on multilingual NLP to comply with Indian language support mandates.", clause: "India AI Sutra 2026 §4.2" },
];

export default function DocumentAnalysisPage() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisReady, setAnalysisReady] = useState(false);
    const [fileName, setFileName] = useState("");

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setIsAnalyzing(true);
            setAnalysisReady(false);
            setTimeout(() => {
                setIsAnalyzing(false);
                setAnalysisReady(true);
            }, 3000);
        }
    };

    const gaps = MOCK_ANALYSIS.filter((a) => a.type === "gap");
    const compliant = MOCK_ANALYSIS.filter((a) => a.type === "compliance");
    const upgrades = MOCK_ANALYSIS.filter((a) => a.type === "upgrade");

    return (
        <div className="p-6 space-y-6 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <FileText className="w-6 h-6 text-[#D4AF37]" />
                        Document Analysis Lab
                    </h1>
                    <p className="text-white/40 text-sm mt-0.5">
                        AI-powered curriculum and policy compliance auditor
                    </p>
                </div>
                <label className="px-5 py-2.5 bg-[#D4AF37] text-[#001229] text-sm font-bold rounded-full hover:bg-[#e8c84a] transition cursor-pointer shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Document
                    <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleUpload} />
                </label>
            </div>

            {/* Dual-Pane */}
            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-180px)]">
                {/* Left: Document View */}
                <div className="col-span-12 lg:col-span-5">
                    <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl h-full flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-sm font-bold">Document Preview</span>
                            {fileName && <span className="text-[10px] text-white/30 ml-auto font-mono truncate max-w-[200px]">{fileName}</span>}
                        </div>
                        <div className="flex-1 p-6 flex items-center justify-center">
                            {!fileName ? (
                                <div className="text-center">
                                    <FileText className="w-16 h-16 text-white/[0.06] mx-auto mb-4" />
                                    <p className="text-white/30 text-sm">Upload a PDF syllabus or policy document</p>
                                    <p className="text-white/15 text-xs mt-1">Supports PDF, DOC, DOCX, TXT</p>
                                </div>
                            ) : (
                                <div className="w-full h-full bg-white/[0.02] rounded-xl border border-white/[0.06] p-6 space-y-4 overflow-y-auto custom-scrollbar">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                                        <span className="text-xs font-semibold text-white/50">{fileName}</span>
                                    </div>
                                    {/* Simulated document content */}
                                    {[
                                        "B.Tech Computer Science & Engineering",
                                        "Semester V – Course Structure 2025-26",
                                        "",
                                        "CS301 – Data Structures & Algorithms",
                                        "CS302 – Operating Systems",
                                        "CS303 – Database Management Systems",
                                        "CS304 – Software Engineering",
                                        "CS305 – Computer Networks",
                                        "HS301 – Professional Ethics",
                                        "",
                                        "Program Outcomes (POs):",
                                        "PO1: Apply engineering fundamentals",
                                        "PO2: Analyze complex problems",
                                        "PO3: Design innovative solutions",
                                        "",
                                        "Assessment: Continuous Internal (40%)",
                                        "          End Semester Exam (60%)",
                                    ].map((line, i) => (
                                        <div key={i} className={`text-[12px] font-mono leading-relaxed ${line === "" ? "h-3" :
                                                i < 2 ? "text-white/70 font-bold" :
                                                    line.startsWith("PO") ? "text-emerald-400/70" :
                                                        line.startsWith("CS") || line.startsWith("HS") ? "text-white/50" :
                                                            "text-white/30"
                                            }`}>
                                            {line}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: AI Auditor Breakdown */}
                <div className="col-span-12 lg:col-span-7">
                    <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl h-full flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
                            <Brain className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-sm font-bold">AI Auditor Analysis</span>
                            {analysisReady && (
                                <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">COMPLETE</span>
                            )}
                        </div>

                        {isAnalyzing ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                                <motion.div
                                    className="w-16 h-16 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <p className="text-sm text-white/40 font-mono">Analyzing document structure...</p>
                            </div>
                        ) : !analysisReady ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <Target className="w-16 h-16 text-white/[0.06] mx-auto mb-4" />
                                    <p className="text-white/30 text-sm">Upload a document to begin analysis</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                                {/* Summary Cards */}
                                <div className="grid grid-cols-3 gap-3">
                                    <SummaryCard icon={AlertTriangle} label="Skill Gaps" count={gaps.length} color="text-red-400" bg="bg-red-500/10 border-red-500/20" />
                                    <SummaryCard icon={CheckCircle2} label="Compliant" count={compliant.length} color="text-emerald-400" bg="bg-emerald-500/10 border-emerald-500/20" />
                                    <SummaryCard icon={TrendingUp} label="Upgrades" count={upgrades.length} color="text-[#D4AF37]" bg="bg-[#D4AF37]/10 border-[#D4AF37]/20" />
                                </div>

                                {/* Gaps */}
                                <Section title="Skill Gaps & Non-Compliance" items={gaps} icon={AlertTriangle} colorClass="text-red-400 bg-red-500/[0.08] border-red-500/20" />
                                {/* Compliant */}
                                <Section title="Quality Compliance" items={compliant} icon={CheckCircle2} colorClass="text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20" />
                                {/* Upgrades */}
                                <Section title="Probable Upgrades" items={upgrades} icon={Zap} colorClass="text-[#D4AF37] bg-[#D4AF37]/[0.08] border-[#D4AF37]/20" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ icon: Icon, label, count, color, bg }: { icon: typeof AlertTriangle; label: string; count: number; color: string; bg: string }) {
    return (
        <div className={`p-4 rounded-xl border ${bg}`}>
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <span className={`text-2xl font-black ${color}`}>{count}</span>
            <p className="text-[10px] text-white/40 font-semibold mt-0.5">{label}</p>
        </div>
    );
}

function Section({ title, items, icon: Icon, colorClass }: { title: string; items: AnalysisItem[]; icon: typeof AlertTriangle; colorClass: string }) {
    const parts = colorClass.split(" ");
    const textColor = parts[0];
    return (
        <div>
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${textColor}`} />
                {title}
            </h3>
            <div className="space-y-2">
                {items.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-4 rounded-xl border ${colorClass.split(" ").slice(1).join(" ")}`}
                    >
                        <h4 className="text-sm font-bold text-white/90">{item.title}</h4>
                        <p className="text-[11px] text-white/40 mt-1 leading-relaxed">{item.detail}</p>
                        <p className="text-[10px] font-mono text-white/25 mt-2">{item.clause}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
