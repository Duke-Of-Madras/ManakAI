"use client";

import { useState } from "react";
import { Download, Loader2, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function GenerateReportBtn() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [complete, setComplete] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setComplete(false);

        setTimeout(() => {
            setIsGenerating(false);
            setComplete(true);

            // Reset after a bit
            setTimeout(() => setComplete(false), 3000);
        }, 2000);
    };

    return (
        <button
            onClick={handleGenerate}
            disabled={isGenerating || complete}
            className={cn(
                "relative w-full overflow-hidden rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg active:scale-95",
                "flex items-center justify-center p-4",
                isGenerating ? "bg-slate-800 text-white cursor-not-allowed" :
                    complete ? "bg-green-600 text-white" :
                        "bg-manak-gold text-manak-navy hover:bg-[#ebd483]"
            )}
        >
            {/* Animated Shine Effect */}
            {!isGenerating && !complete && (
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
            )}

            {isGenerating ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    COMPILE BIS-READY AUDIT...
                </>
            ) : complete ? (
                <>
                    <FileCheck className="w-5 h-5 mr-2" />
                    PDF GENERATED
                </>
            ) : (
                <>
                    <Download className="w-5 h-5 mr-3" />
                    GENERATE BIS-READY AUDIT REPORT
                </>
            )}
        </button>
    );
}
