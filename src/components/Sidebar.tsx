"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    ScanEye,
    FileText,
    Library,
    History,
    ShieldCheck,
    Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, desc: "Nerve Center" },
    { name: "Vision-Audit", href: "/vision-audit", icon: ScanEye, desc: "Infra Scanner" },
    { name: "Doc Analysis", href: "/document-analysis", icon: FileText, desc: "Curriculum Lab" },
    { name: "Standards Wiki", href: "/wiki", icon: Library, desc: "BIS Knowledge" },
    { name: "Audit Logs", href: "/logs", icon: History, desc: "Paper Trail" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[260px] h-full bg-[#001229] text-white flex flex-col border-r border-white/[0.06] shrink-0 z-30">
            {/* Brand */}
            <div className="h-[72px] flex items-center px-5 border-b border-white/[0.06] gap-3 shrink-0">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                    <ShieldCheck className="w-5 h-5 text-[#001229]" />
                </div>
                <div>
                    <span className="font-bold text-[15px] tracking-tight block leading-tight">
                        Manak<span className="text-[#D4AF37]">AI</span>
                    </span>
                    <span className="text-[10px] text-white/40 font-medium tracking-widest uppercase">
                        BIS Compliance
                    </span>
                </div>
            </div>

            {/* Live Indicator */}
            <div className="mx-4 mt-5 mb-4 px-3 py-2 rounded-lg bg-[#D4AF37]/[0.08] border border-[#D4AF37]/20 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                <span className="text-[11px] text-[#D4AF37] font-semibold tracking-wide">SYSTEM ACTIVE</span>
                <span className="text-[10px] text-white/30 ml-auto font-mono">v2.4</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href}>
                            <div
                                className={cn(
                                    "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group cursor-pointer",
                                    isActive ? "text-white" : "text-white/50 hover:text-white/80"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-white/[0.07] border border-white/[0.08] rounded-lg"
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                                <item.icon
                                    className={cn(
                                        "w-[18px] h-[18px] relative z-10 transition-colors",
                                        isActive ? "text-[#D4AF37]" : "text-white/30 group-hover:text-white/60"
                                    )}
                                />
                                <div className="relative z-10 flex flex-col">
                                    <span className="font-semibold text-[13px] leading-tight">{item.name}</span>
                                    <span className="text-[10px] text-white/25 leading-tight">{item.desc}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Logos */}
            <div className="p-4 border-t border-white/[0.06] space-y-3">
                <div className="flex items-center gap-3 px-1">
                    <div className="w-7 h-7 bg-white/[0.08] rounded border border-white/[0.08] flex items-center justify-center text-[9px] font-black text-white/60">
                        VIT
                    </div>
                    <div className="w-7 h-7 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/20 flex items-center justify-center text-[9px] font-black text-[#D4AF37]/80">
                        BIS
                    </div>
                    <span className="text-[10px] text-white/20 ml-auto">Chennai Node</span>
                </div>
            </div>
        </aside>
    );
}
