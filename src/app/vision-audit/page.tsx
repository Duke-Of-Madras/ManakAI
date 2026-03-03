"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { T } from "@/components/TranslatedText";
import {
    UploadCloud,
    CheckCircle2,
    AlertTriangle,
    Maximize,
    ScanEye,
    AlertCircle,
    ArrowRight,
    Zap,
    Shield,
    Loader2,
    Building2,
    MapPin,
    History,
} from "lucide-react";

interface VisionTag {
    label: string;
    status: "pass" | "fail" | "warning";
    clause: string;
}

interface VisionGap {
    title: string;
    clause: string;
    severity: "high" | "medium" | "low";
    location: string;
    recommendation: string;
}

interface VisionResult {
    overallScore: number;
    summary: string;
    tags: VisionTag[];
    gaps: VisionGap[];
    scanId?: string;
    buildingName?: string;
    placeName?: string;
}

interface ScanHistoryItem {
    id: string;
    buildingName: string;
    placeName: string;
    score: number;
    timestamp: string;
}

export default function VisionAuditPage() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<VisionResult | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);
    const [buildingName, setBuildingName] = useState("");
    const [placeName, setPlaceName] = useState("");
    const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        if (!file.type.startsWith("image/")) return;
        setPreviewUrl(URL.createObjectURL(file));
        setScanResult(null);
        setScanError(null);
        setIsScanning(true);

        try {
            // Convert to base64
            const base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });

            const res = await fetch("/api/vision-audit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64, buildingName: buildingName || "Unknown Building", placeName: placeName || "Unknown Facility" }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setScanResult(data);

            // Add to batch scan history
            setScanHistory(prev => [{
                id: data.scanId || `local-${Date.now()}`,
                buildingName: buildingName || "Unknown Building",
                placeName: placeName || "Unknown Facility",
                score: data.overallScore || 0,
                timestamp: new Date().toLocaleTimeString("en-IN", { hour12: false }),
            }, ...prev]);
        } catch (err) {
            setScanError(err instanceof Error ? err.message : "Analysis failed");
        } finally {
            setIsScanning(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const tagColorMap: Record<string, string> = {
        pass: "bg-emerald-500/90",
        fail: "bg-red-500/90",
        warning: "bg-amber-500/90",
    };
    const tagIconMap: Record<string, typeof CheckCircle2> = {
        pass: CheckCircle2,
        fail: AlertTriangle,
        warning: Zap,
    };

    const getTagColor = (status: string) => tagColorMap[status] || "bg-white/20";
    const getTagIcon = (status: string) => tagIconMap[status] || AlertCircle;

    return (
        <div className="p-6 space-y-6 min-h-screen">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <ScanEye className="w-6 h-6 text-[#D4AF37]" />
                        <T>Vision-Audit Scanner</T>
                    </h1>
                    <p className="text-white/40 text-sm mt-0.5">
                        <T>Multimodal infrastructure compliance analysis powered by Gemini Vision AI</T>
                    </p>
                </div>
            </div>

            {/* Location Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-xl p-4 flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
                    <div className="flex-1">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Building Name</label>
                        <input
                            type="text"
                            value={buildingName}
                            onChange={(e) => setBuildingName(e.target.value)}
                            placeholder="e.g. Academic Block A"
                            className="w-full bg-transparent border-none outline-none text-white text-sm mt-0.5 placeholder-white/20"
                        />
                    </div>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-xl p-4 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0" />
                    <div className="flex-1">
                        <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Facility / Room</label>
                        <input
                            type="text"
                            value={placeName}
                            onChange={(e) => setPlaceName(e.target.value)}
                            placeholder="e.g. Chemistry Lab"
                            className="w-full bg-transparent border-none outline-none text-white text-sm mt-0.5 placeholder-white/20"
                        />
                    </div>
                </div>
            </div>

            {/* Split View */}
            <div className="grid grid-cols-12 gap-6">
                {/* Left: Scanner */}
                <div className="col-span-12 lg:col-span-7">
                    <div
                        className="relative bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl overflow-hidden h-[520px] group cursor-pointer"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => !previewUrl && fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        {!previewUrl ? (
                            <div className="flex flex-col items-center justify-center h-full space-y-5">
                                <motion.div
                                    className="w-20 h-20 rounded-2xl bg-white/[0.05] border border-dashed border-white/20 flex items-center justify-center"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                >
                                    <UploadCloud className="w-8 h-8 text-white/40" />
                                </motion.div>
                                <div className="text-center">
                                    <h3 className="font-bold text-white/80 text-lg"><T>Drop Infrastructure Image</T></h3>
                                    <p className="text-white/30 text-sm mt-1 max-w-xs">
                                        <T>Upload a photo of any facility for real AI-powered BIS compliance analysis</T>
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                    className="px-6 py-2.5 bg-[#D4AF37] text-[#001229] text-sm font-bold rounded-full hover:bg-[#e8c84a] transition shadow-lg shadow-[#D4AF37]/20"
                                >
                                    <T>Initialize Scanner</T>
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={previewUrl} alt="Scan Target" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-[#002147]/30" />

                                {/* Scan Controls */}
                                <div className="absolute top-4 right-4 flex gap-2 z-20">
                                    <button className="w-8 h-8 bg-black/60 backdrop-blur rounded-lg flex items-center justify-center text-white/70 hover:text-white transition">
                                        <Maximize className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const input = fileInputRef.current;
                                            if (input?.files?.[0]) handleFile(input.files[0]);
                                        }}
                                        className="px-3 py-1.5 bg-[#D4AF37]/90 text-[#001229] text-xs font-bold rounded-lg hover:bg-[#D4AF37] transition"
                                    >
                                        <T>Re-Scan</T>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreviewUrl(null);
                                            setScanResult(null);
                                            setScanError(null);
                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                            setTimeout(() => fileInputRef.current?.click(), 100);
                                        }}
                                        className="px-3 py-1.5 bg-white/10 backdrop-blur text-white text-xs font-bold rounded-lg hover:bg-white/20 transition border border-white/10"
                                    >
                                        <T>New Scan</T>
                                    </button>
                                </div>

                                {/* Score Badge */}
                                {scanResult && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute top-4 left-4 bg-black/80 backdrop-blur-md rounded-xl px-4 py-3 z-20 border border-white/10"
                                    >
                                        <div className="text-[10px] text-white/40 font-semibold uppercase mb-1"><T>Compliance Score</T></div>
                                        <div className={`text-3xl font-black ${scanResult.overallScore >= 70 ? "text-emerald-400" : scanResult.overallScore >= 50 ? "text-amber-400" : "text-red-400"}`}>
                                            {scanResult.overallScore}%
                                        </div>
                                    </motion.div>
                                )}

                                {/* Laser Scan Animation */}
                                {isScanning && (
                                    <motion.div
                                        className="absolute left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_20px_5px_rgba(212,175,55,0.5)] z-10"
                                        initial={{ top: "0%" }}
                                        animate={{ top: ["0%", "100%", "0%"] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                    />
                                )}

                                {/* Scanning status */}
                                {isScanning && (
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-full px-6 py-2.5 text-[#D4AF37] text-xs font-mono tracking-[0.2em] flex items-center gap-3 z-20 border border-[#D4AF37]/20">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="uppercase"><T>Gemini Vision is analyzing...</T></span>
                                    </div>
                                )}

                                {/* Real AR Tags from Gemini */}
                                <AnimatePresence>
                                    {scanResult && scanResult.tags.map((tag, i) => {
                                        const Icon = getTagIcon(tag.status);
                                        // Distribute tags across the image
                                        const positions = [
                                            { top: "20%", left: "12%" },
                                            { top: "55%", left: "55%" },
                                            { top: "75%", left: "20%" },
                                            { top: "35%", left: "70%" },
                                            { top: "65%", left: "40%" },
                                        ];
                                        const pos = positions[i % positions.length];
                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ delay: i * 0.3, type: "spring" }}
                                                className={`absolute ${getTagColor(tag.status)} backdrop-blur-sm rounded-lg py-2 px-3 text-xs font-bold text-white flex items-center gap-2 z-20 shadow-lg cursor-pointer hover:-translate-y-1 transition-transform`}
                                                style={{ top: pos.top, left: pos.left }}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <div>
                                                    <div>{tag.label}</div>
                                                    <div className="text-[10px] font-normal opacity-75">{tag.clause}</div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </>
                        )}
                    </div>
                </div>

                {/* Right: Detected Gaps */}
                <div className="col-span-12 lg:col-span-5">
                    <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl h-[520px] flex flex-col overflow-hidden">
                        <div className="p-5 border-b border-white/[0.06] flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-[#D4AF37]" />
                            <h2 className="text-sm font-bold"><T>Detected Infrastructure Gaps</T></h2>
                            {scanResult && (
                                <span className="ml-auto text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold uppercase">
                                    {scanResult.gaps.length} <T>ISSUES</T>
                                </span>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {isScanning ? (
                                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                                    <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
                                    <p className="text-white/40 text-sm"><T>Gemini Vision is analyzing...</T></p>
                                </div>
                            ) : scanError ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <AlertTriangle className="w-12 h-12 text-red-400/40 mb-3" />
                                    <p className="text-red-400/70 text-sm">{scanError}</p>
                                </div>
                            ) : !scanResult ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <Shield className="w-12 h-12 text-white/10 mb-3" />
                                    <p className="text-white/30 text-sm"><T>Upload and scan an image to detect compliance gaps</T></p>
                                </div>
                            ) : (
                                <>
                                    {/* Summary */}
                                    <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-[11px] text-white/50">
                                        {scanResult.summary}
                                    </div>
                                    {/* Gaps */}
                                    {scanResult.gaps.map((gap, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={`p-4 rounded-xl border ${gap.severity === "high"
                                                ? "bg-red-500/[0.08] border-red-500/20"
                                                : gap.severity === "medium"
                                                    ? "bg-amber-500/[0.08] border-amber-500/20"
                                                    : "bg-blue-500/[0.08] border-blue-500/20"
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${gap.severity === "high" ? "text-red-400" :
                                                    gap.severity === "medium" ? "text-amber-400" : "text-blue-400"
                                                    }`} />
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-white/90">{gap.title}</h4>
                                                    <p className="text-[11px] text-white/40 mt-0.5 font-mono">{gap.clause}</p>
                                                    <p className="text-[11px] text-white/30 mt-0.5">📍 {gap.location}</p>
                                                    {gap.recommendation && (
                                                        <p className="text-[11px] text-emerald-400/60 mt-1">💡 {gap.recommendation}</p>
                                                    )}
                                                    <button className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#D4AF37] hover:text-[#e8c84a] transition">
                                                        <T>Remediate</T> <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Batch Scan History */}
            {scanHistory.length > 0 && (
                <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <History className="w-5 h-5 text-[#D4AF37]" />
                        <h3 className="font-bold text-sm"><T>Scan History</T></h3>
                        <span className="text-[10px] text-white/30 ml-auto">{scanHistory.length} scan(s) this session</span>
                    </div>
                    <div className="space-y-2">
                        {scanHistory.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/[0.04] hover:bg-white/[0.04] transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.score >= 80 ? "bg-emerald-500/15 text-emerald-400" : item.score >= 60 ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"}`}>
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-white/80">{item.buildingName}</span>
                                        <span className="text-white/30 mx-2">→</span>
                                        <span className="text-sm text-white/60">{item.placeName}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] text-white/30 font-mono">{item.timestamp}</span>
                                    <span className={`text-sm font-bold ${item.score >= 80 ? "text-emerald-400" : item.score >= 60 ? "text-amber-400" : "text-red-400"}`}>
                                        {item.score}%
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
