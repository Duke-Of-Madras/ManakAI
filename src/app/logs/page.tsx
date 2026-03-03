"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useManakAI } from "@/hooks/useManakAI";
import { generateBISReport } from "@/lib/reportGenerator";
import {
    History,
    Download,
    Loader2,
    FileCheck,
    ScanEye,
    FileText,
    Shield,
    Settings,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Filter,
} from "lucide-react";

export default function AuditLogsPage() {
    const data = useManakAI();
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportReady, setReportReady] = useState(false);
    const [filter, setFilter] = useState("all");

    const handleGenerateReport = () => {
        setIsGenerating(true);
        setReportReady(false);

        // Small delay for UX (let progress bar animate), then generate real PDF
        setTimeout(() => {
            try {
                generateBISReport({
                    institutionalScore: data.institutionalScore,
                    infraScore: data.infraScore,
                    academicScore: data.academicScore,
                    governanceScore: data.governanceScore,
                    buildings: data.buildings.map((b) => ({
                        name: b.name,
                        score: b.score,
                        status: b.status,
                    })),
                    auditLogs: data.auditLogs.map((l) => ({
                        title: l.action,
                        description: l.result,
                        timestamp: l.timestamp,
                        module: l.module,
                        actor: l.user,
                        score: l.score,
                    })),
                    generatedAt: new Date().toLocaleString("en-IN", {
                        dateStyle: "full",
                        timeStyle: "short",
                    }),
                });
                setReportReady(true);
                setTimeout(() => setReportReady(false), 8000);
            } catch (err) {
                console.error("PDF generation failed:", err);
            }
            setIsGenerating(false);
        }, 2000);
    };

    const getModuleIcon = (module: string) => {
        if (module === "Vision-Audit") return ScanEye;
        if (module === "Reports") return FileText;
        if (module === "Standards Wiki") return Shield;
        if (module === "Document Analysis") return FileText;
        if (module === "Dashboard") return Shield;
        return Settings;
    };

    const filteredLogs = filter === "all"
        ? data.auditLogs
        : data.auditLogs.filter((l) => l.module.toLowerCase().includes(filter));

    return (
        <div className="p-6 space-y-6 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <History className="w-6 h-6 text-[#D4AF37]" />
                        Audit Logs & Reports
                    </h1>
                    <p className="text-white/40 text-sm mt-0.5">
                        Chronological record of all compliance activities
                    </p>
                </div>

                {/* Generate Report Button */}
                <motion.button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className={`relative overflow-hidden px-7 py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center gap-2 ${isGenerating
                        ? "bg-white/10 text-white/60 cursor-wait"
                        : reportReady
                            ? "bg-emerald-600 text-white"
                            : "bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#001229] hover:shadow-[#D4AF37]/30 hover:shadow-xl"
                        }`}
                    whileHover={!isGenerating ? { scale: 1.02 } : {}}
                    whileTap={!isGenerating ? { scale: 0.98 } : {}}
                >
                    {/* Shimmer */}
                    {!isGenerating && !reportReady && (
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                    )}
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Compiling BIS-Ready Audit...
                        </>
                    ) : reportReady ? (
                        <>
                            <FileCheck className="w-5 h-5" />
                            PDF Ready — Download
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            Generate BIS-Ready Audit Report
                        </>
                    )}
                </motion.button>
            </div>

            {/* Progress bar when generating */}
            {isGenerating && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/50 font-semibold">Compiling Report...</span>
                        <span className="text-xs text-[#D4AF37] font-mono">Processing</span>
                    </div>
                    <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#e8c84a] rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3.5, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            )}

            {/* Report Preview */}
            {reportReady && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] border border-emerald-500/20 rounded-2xl p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <FileCheck className="w-6 h-6 text-emerald-400" />
                        <div>
                            <h3 className="text-sm font-bold">ManakAI Compliance Report — March 2026</h3>
                            <p className="text-[11px] text-white/40">Generated for VIT Chennai • BIS Project Compliance-AI Track</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.06] text-center">
                            <span className="text-xl font-black text-[#D4AF37]">{data.institutionalScore}</span>
                            <p className="text-[10px] text-white/30 mt-0.5">Overall Score</p>
                        </div>
                        <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.06] text-center">
                            <span className="text-xl font-black text-emerald-400">{data.infraScore}</span>
                            <p className="text-[10px] text-white/30 mt-0.5">Infrastructure</p>
                        </div>
                        <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.06] text-center">
                            <span className="text-xl font-black text-emerald-400">{data.academicScore}</span>
                            <p className="text-[10px] text-white/30 mt-0.5">Academic</p>
                        </div>
                        <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.06] text-center">
                            <span className="text-xl font-black text-emerald-400">{data.governanceScore}</span>
                            <p className="text-[10px] text-white/30 mt-0.5">Governance</p>
                        </div>
                    </div>
                    <div className="text-[11px] text-white/30 font-mono">
                        Report ID: MANAK-RPT-2026-0302-{Math.random().toString(36).slice(2, 8).toUpperCase()} • Format: PDF/A-3
                    </div>
                </motion.div>
            )}

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-white/30" />
                {["all", "vision", "reports", "system", "dashboard"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${filter === f
                            ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                            : "bg-white/[0.03] text-white/40 border border-white/[0.06] hover:text-white/60"
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Timeline */}
            <div className="space-y-1">
                {filteredLogs.map((log, i) => {
                    const Icon = getModuleIcon(log.module);
                    const hasScore = log.score !== undefined;
                    const isGood = hasScore && (log.score ?? 0) >= 80;

                    return (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-4 p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl border border-transparent hover:border-white/[0.06] transition-all group"
                        >
                            {/* Timeline dot */}
                            <div className="flex flex-col items-center pt-1">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${log.result.toLowerCase().includes("critical") ? "bg-red-500/15 text-red-400" :
                                    hasScore && !isGood ? "bg-amber-500/15 text-amber-400" :
                                        "bg-[#D4AF37]/10 text-[#D4AF37]"
                                    }`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-white/90">{log.action}</h4>
                                    {log.result.toLowerCase().includes("critical") && (
                                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                                    )}
                                </div>
                                <p className="text-[11px] text-white/40 mt-0.5">{log.result}</p>
                                <div className="flex items-center gap-3 mt-2 text-[10px] text-white/25">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{log.timestamp}</span>
                                    <span className="px-1.5 py-0.5 bg-white/[0.05] rounded text-white/30">{log.module}</span>
                                    <span>{log.user}</span>
                                </div>
                            </div>

                            {/* Score badge */}
                            {hasScore && (
                                <div className={`px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shrink-0 ${isGood ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                                    }`}>
                                    {isGood ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                    {log.score}%
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
