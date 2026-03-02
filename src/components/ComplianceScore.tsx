"use client";

import { motion } from "framer-motion";
import { Activity, Building2, GraduationCap, Scale, type LucideIcon } from "lucide-react";

interface ComplianceScoreProps {
    score: number;
    metrics: {
        infrastructure: number;
        academic: number;
        governance: number;
    };
}

export function ComplianceScore({ score, metrics }: ComplianceScoreProps) {
    const strokeDashoffset = 440 - (440 * score) / 100;

    const getScoreColor = (value: number) => {
        if (value >= 90) return "text-green-400 stroke-green-400";
        if (value >= 70) return "text-manak-gold stroke-manak-gold";
        return "text-red-400 stroke-red-400";
    };

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/20 p-6 rounded-xl flex flex-col items-center shadow-lg relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-manak-gold/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex w-full items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-manak-gold" />
                    Health Status
                </h2>
                <div className="text-xs font-mono bg-manak-navy/50 px-2 py-1 rounded border border-white/10 text-white/70">
                    LIVE V2.0
                </div>
            </div>

            {/* Radial Gauge */}
            <div className="relative flex items-center justify-center w-48 h-48 mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    {/* Background Circle */}
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-white/10"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="12"
                        strokeLinecap="round"
                        className={getScoreColor(score)}
                        strokeDasharray="440"
                        initial={{ strokeDashoffset: 440 }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <motion.span
                        className="text-4xl font-black tabular-nums tracking-tighter"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {score}
                    </motion.span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Score</span>
                </div>
            </div>

            {/* Metric Tiles */}
            <div className="grid grid-cols-3 gap-3 w-full">
                <MetricTile icon={Building2} label="Infra" value={metrics.infrastructure} />
                <MetricTile icon={GraduationCap} label="Acad" value={metrics.academic} />
                <MetricTile icon={Scale} label="Gov" value={metrics.governance} />
            </div>
        </div>
    );
}

function MetricTile({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: number }) {
    const isGood = value >= 75;
    return (
        <div className="bg-white/10 border border-white/10 rounded-lg p-3 flex flex-col items-center justify-center text-center transition-colors hover:bg-white/20">
            <Icon className={`w-5 h-5 mb-2 ${isGood ? 'text-manak-gold' : 'text-red-400'}`} />
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{label}</span>
            <span className="text-sm font-bold">{value}%</span>
        </div>
    );
}
