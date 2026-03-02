"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle2, AlertTriangle, Maximize } from "lucide-react";

interface VisionAuditScannerProps {
    onScanComplete: () => void;
    isScanning: boolean;
    setIsScanning: (val: boolean) => void;
    hasResult: boolean;
}

export function VisionAuditScanner({ onScanComplete, isScanning, setIsScanning, hasResult }: VisionAuditScannerProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            startScan();
        }
    };

    const startScan = () => {
        setIsScanning(true);
        // Simulate scan duration
        setTimeout(() => {
            setIsScanning(false);
            onScanComplete();
        }, 2500);
    };

    return (
        <div className="relative w-full h-[450px] bg-manak-navy/5 border-2 border-dashed border-manak-navy/20 hover:border-manak-gold/50 transition-colors rounded-2xl flex flex-col items-center justify-center overflow-hidden group">
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {!previewUrl && (
                <label onClick={() => fileInputRef.current?.click()} className="cursor-pointer flex flex-col items-center justify-center space-y-4 z-10">
                    <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-manak-navy border border-slate-100 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-manak-navy text-lg">Drop surveillance feed</h3>
                        <p className="text-slate-500 text-sm max-w-xs mt-1">Upload an image of the infrastructure for instant BIS compliance analysis</p>
                    </div>
                    <button className="px-6 py-2 bg-manak-navy text-white text-sm font-semibold rounded-full hover:bg-manak-navy/90 transition shadow-md">
                        Initialize Scanner
                    </button>
                </label>
            )}

            {previewUrl && (
                <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Audit Preview" className="w-full h-full object-cover opacity-90" />
                    <div className="absolute inset-0 bg-manak-navy/20 mix-blend-multiply" />

                    {/* Top Right Tools */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button className="w-8 h-8 bg-black/50 backdrop-blur rounded flex items-center justify-center text-white hover:bg-black/70 transition">
                            <Maximize className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Framer Motion Gold Laser Scan */}
            {isScanning && previewUrl && (
                <motion.div
                    className="absolute top-0 left-0 w-full h-[4px] bg-manak-gold shadow-[0_0_15px_3px_#D4AF37] z-20"
                    initial={{ top: "0%" }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
            )}

            {/* Interactive AR Tags Overlay (Visible After Scan) */}
            <AnimatePresence>
                {hasResult && !isScanning && previewUrl && (
                    <>
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="absolute top-[30%] left-[25%] bg-white/90 backdrop-blur-sm border-l-4 border-green-500 shadow-xl rounded py-1 px-3 text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer hover:-translate-y-1 transition-transform z-20"
                        >
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            <span>ISI Certified Structure</span>
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="absolute top-[60%] left-[65%] bg-white/90 backdrop-blur-sm border-l-4 border-red-500 shadow-xl rounded py-1 px-3 text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer hover:-translate-y-1 transition-transform z-20"
                        >
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                            <span>Quality Gap Detected</span>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Scanning status overlay */}
            {isScanning && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur rounded-full px-6 py-2 text-manak-gold text-sm font-mono tracking-widest flex items-center gap-3 z-30 shadow-2xl border border-manak-gold/20">
                    <div className="w-2 h-2 bg-manak-gold rounded-full animate-pulse" />
                    ANALYZING VISION DATA...
                </div>
            )}
        </div>
    );
}
