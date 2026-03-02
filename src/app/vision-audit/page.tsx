"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useManakAI } from "@/hooks/useManakAI";
import {
    UploadCloud,
    CheckCircle2,
    AlertTriangle,
    Maximize,
    ScanEye,
    AlertCircle,
    ArrowRight,
    Zap,
    Target,
    Shield,
} from "lucide-react";

export default function VisionAuditPage() {
    const data = useManakAI();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            setScanComplete(false);
            setIsScanning(true);
            setTimeout(() => {
                setIsScanning(false);
                setScanComplete(true);
            }, 5000);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setPreviewUrl(URL.createObjectURL(file));
            setScanComplete(false);
            setIsScanning(true);
            setTimeout(() => {
                setIsScanning(false);
                setScanComplete(true);
            }, 5000);
        }
    };

    return (
        <div className="p-6 space-y-6 min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <ScanEye className="w-6 h-6 text-[#D4AF37]" />
                    Vision-Audit Scanner
                </h1>
                <p className="text-white/40 text-sm mt-0.5">
                    Multimodal infrastructure compliance analysis powered by BIS regulations
                </p>
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
                                    <h3 className="font-bold text-white/80 text-lg">Drop Infrastructure Image</h3>
                                    <p className="text-white/30 text-sm mt-1 max-w-xs">
                                        Upload a photo of any facility for instant BIS compliance verification
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                    className="px-6 py-2.5 bg-[#D4AF37] text-[#001229] text-sm font-bold rounded-full hover:bg-[#e8c84a] transition shadow-lg shadow-[#D4AF37]/20"
                                >
                                    Initialize Scanner
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
                                            setScanComplete(false);
                                            setIsScanning(true);
                                            setTimeout(() => { setIsScanning(false); setScanComplete(true); }, 5000);
                                        }}
                                        className="px-3 py-1.5 bg-[#D4AF37]/90 text-[#001229] text-xs font-bold rounded-lg hover:bg-[#D4AF37] transition"
                                    >
                                        Re-Scan
                                    </button>
                                </div>

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
                                        <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                                        ANALYZING COMPLIANCE DATA...
                                    </div>
                                )}

                                {/* AR Tags */}
                                <AnimatePresence>
                                    {scanComplete && (
                                        <>
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ delay: 0.2, type: "spring" }}
                                                className="absolute top-[25%] left-[15%] bg-emerald-500/90 backdrop-blur-sm rounded-lg py-2 px-3 text-xs font-bold text-white flex items-center gap-2 z-20 shadow-lg cursor-pointer hover:-translate-y-1 transition-transform"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                <div>
                                                    <div>ISI Certified Structure</div>
                                                    <div className="text-[10px] font-normal opacity-75">IS 15700 Cl. 8.1</div>
                                                </div>
                                            </motion.div>
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ delay: 0.5, type: "spring" }}
                                                className="absolute top-[55%] left-[55%] bg-red-500/90 backdrop-blur-sm rounded-lg py-2 px-3 text-xs font-bold text-white flex items-center gap-2 z-20 shadow-lg cursor-pointer hover:-translate-y-1 transition-transform"
                                            >
                                                <AlertTriangle className="w-4 h-4" />
                                                <div>
                                                    <div>Safety Gap Detected</div>
                                                    <div className="text-[10px] font-normal opacity-75">IS 15700 Cl. 5.2</div>
                                                </div>
                                            </motion.div>
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ delay: 0.8, type: "spring" }}
                                                className="absolute top-[75%] left-[25%] bg-amber-500/90 backdrop-blur-sm rounded-lg py-2 px-3 text-xs font-bold text-white flex items-center gap-2 z-20 shadow-lg cursor-pointer hover:-translate-y-1 transition-transform"
                                            >
                                                <Zap className="w-4 h-4" />
                                                <div>
                                                    <div>Wiring Upgrade Needed</div>
                                                    <div className="text-[10px] font-normal opacity-75">IS 732 Cl. 6.3</div>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </div>
                </div>

                {/* Right: Detected Gaps */}
                <div className="col-span-12 lg:col-span-5">
                    <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl h-[520px] flex flex-col overflow-hidden">
                        <div className="p-5 border-b border-white/[0.06] flex items-center gap-2">
                            <Target className="w-4 h-4 text-[#D4AF37]" />
                            <h2 className="text-sm font-bold">Detected Infrastructure Gaps</h2>
                            {scanComplete && (
                                <span className="ml-auto text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                                    {data.infraGaps.length} ISSUES
                                </span>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {!scanComplete ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <Shield className="w-12 h-12 text-white/10 mb-3" />
                                    <p className="text-white/30 text-sm">Upload and scan an image to detect compliance gaps</p>
                                </div>
                            ) : (
                                data.infraGaps.map((gap, i) => (
                                    <motion.div
                                        key={gap.id}
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
                                                <p className="text-[11px] text-white/30 mt-0.5">Location: {gap.location}</p>
                                                <button className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#D4AF37] hover:text-[#e8c84a] transition">
                                                    Remediate <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
