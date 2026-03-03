"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { T } from "@/components/TranslatedText";
import {
    FileText,
    Upload,
    AlertTriangle,
    CheckCircle2,
    Target,
    UploadCloud,
    TrendingUp,
    BookOpen,
    Zap,
    Brain,
} from "lucide-react";

interface AnalysisItem {
    id: string;
    type: "gap" | "compliance" | "upgrade";
    title: string;
    detail: string;
    clause: string;
}

interface AnalysisResult {
    summary: string;
    complianceScore: number;
    gaps: AnalysisItem[];
    compliant: AnalysisItem[];
    upgrades: AnalysisItem[];
}

export default function DocumentAnalysisPage() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [fileName, setFileName] = useState("");
    const [fileContent, setFileContent] = useState("");

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setIsAnalyzing(true);
        setAnalysisResult(null);
        setAnalysisError(null);

        try {
            const isPdf = file.name.toLowerCase().endsWith(".pdf");
            let body: Record<string, string>;

            if (isPdf) {
                // Read PDF as base64, send to server for text extraction
                const base64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const result = reader.result as string;
                        // Strip the data URI prefix to get pure base64
                        resolve(result.includes(",") ? result.split(",")[1] : result);
                    };
                    reader.readAsDataURL(file);
                });
                setFileContent("[PDF file — text is extracted server-side by pdf-parse]");
                body = { fileData: base64, fileName: file.name };
            } else {
                // Read text files directly
                const text = await file.text();
                setFileContent(text);
                body = { text, fileName: file.name };
            }

            const res = await fetch("/api/analyze-document", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setAnalysisResult(data);
        } catch (err) {
            setAnalysisError(err instanceof Error ? err.message : "Analysis failed");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="p-6 space-y-6 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <FileText className="w-6 h-6 text-[#D4AF37]" />
                        <T>Document Analysis Lab</T>
                    </h1>
                    <p className="text-white/40 text-sm mt-0.5">
                        <T>AI-powered curriculum and policy compliance auditor — Powered by Gemini</T>
                    </p>
                </div>
                <label className="px-5 py-2.5 bg-[#D4AF37] text-[#001229] text-sm font-bold rounded-full hover:bg-[#e8c84a] transition cursor-pointer shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <T>Upload Document</T>
                    <input type="file" accept=".pdf,.doc,.docx,.txt,.csv,.md" className="hidden" onChange={handleUpload} />
                </label>
            </div>

            {/* Dual-Pane */}
            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-180px)]">
                {/* Left: Document View */}
                <div className="col-span-12 lg:col-span-5">
                    <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl h-full flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                            <span className="text-sm font-bold"><T>Document Preview</T></span>
                            {fileName && <span className="text-[10px] text-white/30 ml-auto font-mono truncate max-w-[200px]">{fileName}</span>}
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                            {!fileName ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="p-4 border-b border-white/[0.06]">
                                        <h2 className="text-sm font-bold"><T>Upload Document</T></h2>
                                    </div>
                                    <div className="p-8 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl mb-6 bg-white/[0.02]">
                                        <UploadCloud className="w-10 h-10 text-[#D4AF37]/50 mb-3" />
                                        <div className="text-sm font-medium text-white/80"><T>Upload a PDF, DOC, TXT, or MD file</T></div>
                                        <div className="text-xs text-white/40 mt-1"><T>Text will be extracted and analyzed by Gemini</T></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full bg-white/[0.02] rounded-xl border border-white/[0.06] p-6 overflow-y-auto custom-scrollbar">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                                        <span className="text-xs font-semibold text-white/50">{fileName}</span>
                                    </div>
                                    {fileContent ? (
                                        <pre className="text-[11px] font-mono text-white/50 whitespace-pre-wrap leading-relaxed">
                                            {fileContent.slice(0, 5000)}
                                            {fileContent.length > 5000 && (
                                                <span className="text-white/20 block mt-2">... [{fileContent.length - 5000} more characters]</span>
                                            )}
                                        </pre>
                                    ) : (
                                        <p className="text-xs text-white/30"><T>Unable to preview binary file</T></p>
                                    )}
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
                            <span className="text-sm font-bold"><T>AI Auditor Analysis</T></span>
                            {analysisResult && (
                                <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                                    SCORE: {analysisResult.complianceScore}%
                                </span>
                            )}
                        </div>

                        {isAnalyzing ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                                <motion.div
                                    className="w-16 h-16 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <p className="text-sm text-white/40 font-mono"><T>Gemini is analyzing your document...</T></p>
                                <p className="text-xs text-white/20"><T>Checking against IS 15700, ISO 42001, India AI Sutra 2026</T></p>
                            </div>
                        ) : analysisError ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <AlertTriangle className="w-12 h-12 text-red-400/40 mx-auto mb-3" />
                                    <p className="text-red-400/70 text-sm">{analysisError}</p>
                                </div>
                            </div>
                        ) : !analysisResult ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <Target className="w-16 h-16 text-white/[0.06] mx-auto mb-4" />
                                    <p className="text-white/30 text-sm"><T>Upload a document to begin AI analysis</T></p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                                {/* Summary */}
                                {analysisResult.summary && (
                                    <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-[11px] text-white/50 leading-relaxed">
                                        {analysisResult.summary}
                                    </div>
                                )}

                                {/* Summary Cards */}
                                <div className="grid grid-cols-3 gap-3">
                                    <SummaryCard icon={AlertTriangle} label="Skill Gaps" count={analysisResult.gaps.length} color="text-red-400" bg="bg-red-500/10 border-red-500/20" />
                                    <SummaryCard icon={CheckCircle2} label="Compliant" count={analysisResult.compliant.length} color="text-emerald-400" bg="bg-emerald-500/10 border-emerald-500/20" />
                                    <SummaryCard icon={TrendingUp} label="Upgrades" count={analysisResult.upgrades.length} color="text-[#D4AF37]" bg="bg-[#D4AF37]/10 border-[#D4AF37]/20" />
                                </div>

                                {/* Gaps */}
                                {analysisResult.gaps.length > 0 && (
                                    <Section title="Skill Gaps & Non-Compliance" items={analysisResult.gaps} icon={AlertTriangle} colorClass="text-red-400 bg-red-500/[0.08] border-red-500/20" />
                                )}
                                {/* Compliant */}
                                {analysisResult.compliant.length > 0 && (
                                    <Section title="Quality Compliance" items={analysisResult.compliant} icon={CheckCircle2} colorClass="text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20" />
                                )}
                                {/* Upgrades */}
                                {analysisResult.upgrades.length > 0 && (
                                    <Section title="Probable Upgrades" items={analysisResult.upgrades} icon={Zap} colorClass="text-[#D4AF37] bg-[#D4AF37]/[0.08] border-[#D4AF37]/20" />
                                )}
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
                        key={item.id || i}
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
