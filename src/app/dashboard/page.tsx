"use client";

import { useManakAI } from "@/hooks/useManakAI";
import { motion } from "framer-motion";
import AnimatedCounter from "@/components/AnimatedCounter";
import Sparkline from "@/components/Sparkline";
import { T } from "@/components/TranslatedText";
import {
    Activity,
    Building2,
    GraduationCap,
    Scale,
    Radio,
    ArrowUpRight,
    ArrowDownRight,
    Shield,
} from "lucide-react";

export default function DashboardPage() {
    const data = useManakAI();

    const getStatusColor = (status: string) => {
        if (status === "compliant") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        if (status === "warning") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
        return "bg-red-500/20 text-red-400 border-red-500/30";
    };

    const getStatusDot = (status: string) => {
        if (status === "compliant") return "bg-emerald-400";
        if (status === "warning") return "bg-amber-400";
        return "bg-red-400";
    };

    const scoreColor = (s: number) => {
        if (s >= 85) return "text-emerald-400";
        if (s >= 70) return "text-[#D4AF37]";
        return "text-red-400";
    };

    const strokeColor = (s: number) => {
        if (s >= 85) return "stroke-emerald-400";
        if (s >= 70) return "stroke-[#D4AF37]";
        return "stroke-red-400";
    };

    const dashOffset = 440 - (440 * data.institutionalScore) / 100;

    return (
        <div className="p-6 space-y-6 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gradient-gold">
                        <T>Command Center</T>
                    </h1>
                    <p className="text-white/40 text-sm mt-0.5">
                        <T>Real-time institutional compliance monitoring</T>
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full relative">
                    <div className="relative">
                        <Radio className="w-3 h-3 text-emerald-400" />
                        <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping" />
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold tracking-wider"><T>ALL SYSTEMS NOMINAL</T></span>
                </div>
            </div>

            {/* Row 1: Score + Metrics */}
            <div className="grid grid-cols-12 gap-6">
                {/* Central Radial Gauge */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="glow-border bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 h-full flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-3xl" />
                        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />

                        <div className="text-xs font-semibold text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <T>Institutional Quality Score</T>
                        </div>

                        <div className="relative w-52 h-52 mb-4">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                                <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/[0.04]" />
                                {/* Glow track */}
                                <motion.circle
                                    cx="80" cy="80" r="70" fill="none"
                                    strokeWidth="8" strokeLinecap="round"
                                    className={strokeColor(data.institutionalScore)}
                                    strokeDasharray="440"
                                    initial={{ strokeDashoffset: 440 }}
                                    animate={{ strokeDashoffset: dashOffset }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    style={{ filter: "drop-shadow(0 0 8px rgba(212, 175, 55, 0.4))" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <AnimatedCounter
                                    value={data.institutionalScore}
                                    duration={2}
                                    className={`text-5xl font-black ${scoreColor(data.institutionalScore)}`}
                                />
                                <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em] mt-1">
                                    <T>out of 100</T>
                                </span>
                            </div>
                        </div>

                        {/* Sub-metrics */}
                        <div className="grid grid-cols-3 gap-3 w-full mt-2">
                            <MetricCard icon={Building2} label="INFRA" value={data.infraScore} />
                            <MetricCard icon={GraduationCap} label="ACADEMIC" value={data.academicScore} />
                            <MetricCard icon={Scale} label="GOVERNANCE" value={data.governanceScore} />
                        </div>
                    </div>
                </div>

                {/* Compliance Heatmap */}
                <div className="col-span-12 lg:col-span-8">
                    <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 h-full">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-sm font-bold flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-[#D4AF37]" />
                                    <T>Compliance Heatmap</T>
                                </h2>
                                <p className="text-[11px] text-white/30 mt-0.5"><T>Building-wise compliance status</T></p>
                            </div>
                            <div className="flex gap-3 text-[10px] text-white/40">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> <T>Compliant</T></span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> <T>Warning</T></span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> <T>Critical</T></span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {data.buildings.map((b, i) => (
                                <motion.div
                                    key={b.id}
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: i * 0.06, type: "spring", stiffness: 200 }}
                                    className={`p-4 rounded-xl border card-hover-glow ${getStatusColor(b.status)} cursor-pointer`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className={`w-2 h-2 rounded-full mt-1 ${getStatusDot(b.status)}`} />
                                        <AnimatedCounter value={b.score} suffix="%" className="text-lg font-black" duration={1.2} />
                                    </div>
                                    <span className="text-[11px] font-semibold leading-tight block">{b.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2: Live Audit Feed + Trend Cards */}
            <div className="grid grid-cols-12 gap-6">
                {/* Live Audit Feed */}
                <div className="col-span-12 lg:col-span-7">
                    <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 h-[400px] flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold flex items-center gap-2">
                                <div className="relative">
                                    <Radio className="w-4 h-4 text-emerald-400" />
                                    <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
                                </div>
                                <T>Live Audit Feed</T>
                            </h2>
                            <span className="text-[10px] text-white/20 font-mono">AUTO-REFRESH 30s</span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[12px] custom-scrollbar">
                            {data.auditFeed.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={i === 0 ? { opacity: 0, x: -15, backgroundColor: "rgba(212, 175, 55, 0.05)" } : { opacity: 0 }}
                                    animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
                                    transition={{ duration: 0.4 }}
                                    className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors"
                                >
                                    <span className="text-white/20 shrink-0 w-[70px]">{item.timestamp}</span>
                                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${item.type === "alert" ? "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.5)]" :
                                        item.type === "scan" ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" :
                                            item.type === "report" ? "bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.5)]" : "bg-blue-400"
                                        }`} />
                                    <span className="text-white/60">{item.message}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trend Cards */}
                <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
                    <TrendCard title="Infra Compliance" value={data.infraScore} change={+2.3} color="#10b981" />
                    <TrendCard title="Academic Quality" value={data.academicScore} change={+1.1} color="#3b82f6" />
                    <TrendCard title="Governance Adherence" value={data.governanceScore} change={-0.4} color="#D4AF37" />
                    <TrendCard title="Overall Trend" value={data.institutionalScore} change={+1.5} color="#8b5cf6" />
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: number }) {
    const color = value >= 85 ? "text-emerald-400" : value >= 70 ? "text-[#D4AF37]" : "text-red-400";
    return (
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 flex flex-col items-center text-center card-hover-glow">
            <Icon className={`w-4 h-4 mb-1.5 ${color}`} />
            <span className="text-[10px] text-white/30 font-semibold uppercase"><T>{label}</T></span>
            <AnimatedCounter value={value} suffix="%" className={`text-sm font-bold ${color}`} duration={1.8} />
        </div>
    );
}

function TrendCard({ title, value, change, color }: { title: string; value: number; change: number; color: string }) {
    const isPositive = change >= 0;
    return (
        <motion.div
            className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between card-hover-glow"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <span className="text-[11px] text-white/40 font-semibold"><T>{title}</T></span>
            <div className="mt-3">
                <AnimatedCounter value={value} className="text-3xl font-black" duration={1.5} />
                <span className="text-[11px] text-white/30 ml-1">%</span>
            </div>
            <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {isPositive ? "+" : ""}{change}%
                <span className="text-white/20 ml-1 font-normal"><T>vs last audit</T></span>
            </div>
            <div className="mt-3">
                <Sparkline color={color} width={140} height={28} />
            </div>
        </motion.div>
    );
}
