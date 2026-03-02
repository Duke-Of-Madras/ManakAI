"use client";

import { useManakAI } from "@/hooks/useManakAI";
import { motion } from "framer-motion";
import {
    Activity,
    Building2,
    GraduationCap,
    Scale,
    Radio,
    TrendingUp,
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
        if (s >= 70) return "text-amber-400";
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
                    <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
                    <p className="text-white/40 text-sm mt-0.5">
                        Real-time institutional compliance monitoring
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-semibold">ALL SYSTEMS NOMINAL</span>
                </div>
            </div>

            {/* Row 1: Score + Metrics */}
            <div className="grid grid-cols-12 gap-6">
                {/* Central Radial Gauge */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-6 h-full flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-3xl" />
                        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />

                        <div className="text-xs font-semibold text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
                            Institutional Quality Score
                        </div>

                        <div className="relative w-52 h-52 mb-4">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                                <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/[0.05]" />
                                <motion.circle
                                    cx="80" cy="80" r="70" fill="none"
                                    strokeWidth="8" strokeLinecap="round"
                                    className={strokeColor(data.institutionalScore)}
                                    strokeDasharray="440"
                                    initial={{ strokeDashoffset: 440 }}
                                    animate={{ strokeDashoffset: dashOffset }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <motion.span
                                    className={`text-5xl font-black tabular-nums ${scoreColor(data.institutionalScore)}`}
                                    key={data.institutionalScore}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {data.institutionalScore}
                                </motion.span>
                                <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">
                                    out of 100
                                </span>
                            </div>
                        </div>

                        {/* Sub-metrics */}
                        <div className="grid grid-cols-3 gap-3 w-full mt-2">
                            <MetricCard icon={Building2} label="Infra" value={data.infraScore} />
                            <MetricCard icon={GraduationCap} label="Academic" value={data.academicScore} />
                            <MetricCard icon={Scale} label="Governance" value={data.governanceScore} />
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
                                    Compliance Heatmap
                                </h2>
                                <p className="text-[11px] text-white/30 mt-0.5">Building-wise compliance status</p>
                            </div>
                            <div className="flex gap-3 text-[10px] text-white/40">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Compliant</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Warning</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Critical</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {data.buildings.map((b, i) => (
                                <motion.div
                                    key={b.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`p-4 rounded-xl border ${getStatusColor(b.status)} cursor-pointer hover:scale-[1.02] transition-transform`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className={`w-2 h-2 rounded-full mt-1 ${getStatusDot(b.status)}`} />
                                        <span className="text-lg font-black tabular-nums">{b.score}%</span>
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
                                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                                Live Audit Feed
                            </h2>
                            <span className="text-[10px] text-white/20 font-mono">AUTO-REFRESH 30s</span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[12px] custom-scrollbar">
                            {data.auditFeed.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={i === 0 ? { opacity: 0, x: -10 } : false}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors"
                                >
                                    <span className="text-white/20 shrink-0 w-[70px]">{item.timestamp}</span>
                                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${item.type === "alert" ? "bg-red-400" :
                                            item.type === "scan" ? "bg-emerald-400" :
                                                item.type === "report" ? "bg-[#D4AF37]" : "bg-blue-400"
                                        }`} />
                                    <span className="text-white/60">{item.message}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trend Cards */}
                <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
                    <TrendCard title="Infra Compliance" value={data.infraScore} change={+2.3} />
                    <TrendCard title="Academic Quality" value={data.academicScore} change={+1.1} />
                    <TrendCard title="Gov. Adherence" value={data.governanceScore} change={-0.4} />
                    <TrendCard title="Overall Trend" value={data.institutionalScore} change={+1.5} />
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: number }) {
    const color = value >= 85 ? "text-emerald-400" : value >= 70 ? "text-amber-400" : "text-red-400";
    return (
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 flex flex-col items-center text-center">
            <Icon className={`w-4 h-4 mb-1.5 ${color}`} />
            <span className="text-[10px] text-white/30 font-semibold uppercase">{label}</span>
            <span className={`text-sm font-bold ${color}`}>{value}%</span>
        </div>
    );
}

function TrendCard({ title, value, change }: { title: string; value: number; change: number }) {
    const isPositive = change >= 0;
    return (
        <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-[11px] text-white/40 font-semibold">{title}</span>
            <div className="mt-3">
                <span className="text-3xl font-black tabular-nums">{value}</span>
                <span className="text-[11px] text-white/30 ml-1">%</span>
            </div>
            <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {isPositive ? "+" : ""}{change}%
                <span className="text-white/20 ml-1 font-normal">vs last audit</span>
            </div>
            <div className="mt-3 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${isPositive ? "bg-emerald-500" : "bg-red-500"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
            <div className="flex justify-between mt-1">
                <TrendingUp className="w-3 h-3 text-white/10" />
            </div>
        </div>
    );
}
