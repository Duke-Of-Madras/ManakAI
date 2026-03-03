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
    Sun,
    Moon,
    Globe,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { T } from "@/components/TranslatedText";
import { useState } from "react";

const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, desc: "Nerve Center" },
    { name: "Vision-Audit", href: "/vision-audit", icon: ScanEye, desc: "Infra Scanner" },
    { name: "Doc Analysis", href: "/document-analysis", icon: FileText, desc: "Curriculum Lab" },
    { name: "Standards Wiki", href: "/wiki", icon: Library, desc: "BIS Knowledge" },
    { name: "Audit Logs", href: "/logs", icon: History, desc: "Paper Trail" },
];

export function Sidebar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const { language, languageName, setLanguage, languages } = useLanguage();
    const [langOpen, setLangOpen] = useState(false);
    const isDark = theme === "dark";

    return (
        <aside
            className="sidebar-container w-[260px] h-full flex flex-col border-r shrink-0 z-30 transition-colors duration-300"
            style={{
                background: isDark
                    ? "linear-gradient(180deg, #001229 0%, #001a3a 100%)"
                    : "linear-gradient(180deg, #ffffff 0%, #f0f4f8 100%)",
                borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
                color: isDark ? "#ffffff" : "#1a2a3a",
            }}
        >
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
                <div className="relative">
                    <Radio className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="absolute inset-0 rounded-full bg-[#D4AF37]/30 animate-ping" />
                </div>
                <span className="text-[11px] text-[#D4AF37] font-semibold tracking-wide"><T>SYSTEM ACTIVE</T></span>
                <span className="text-[10px] text-white/30 ml-auto font-mono">v2.5</span>
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
                                    isActive
                                        ? "text-white active-nav"
                                        : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-white/[0.07] border border-white/[0.08] rounded-lg shadow-inner"
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                                <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
                                    <item.icon
                                        className={cn(
                                            "w-[18px] h-[18px] relative z-10 transition-colors",
                                            isActive ? "text-[#D4AF37] drop-shadow-[0_0_6px_rgba(212,175,55,0.4)]" : "text-white/30 group-hover:text-white/60"
                                        )}
                                    />
                                </motion.div>
                                <div className="relative z-10 flex flex-col">
                                    <span className="font-semibold text-[13px] leading-tight"><T>{item.name}</T></span>
                                    <span className="text-[10px] text-white/25 leading-tight"><T>{item.desc}</T></span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Controls */}
            <div className="px-3 pb-2 space-y-2">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all hover:bg-white/[0.05] group"
                >
                    <motion.div
                        key={theme}
                        initial={{ rotate: -90, scale: 0.5 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {theme === "dark" ? (
                            <Sun className="w-[18px] h-[18px] text-[#D4AF37]" />
                        ) : (
                            <Moon className="w-[18px] h-[18px] text-[#D4AF37]" />
                        )}
                    </motion.div>
                    <span className="text-white/50 text-[13px] font-semibold group-hover:text-white/80 transition-colors">
                        {theme === "dark" ? <T>Light Mode</T> : <T>Dark Mode</T>}
                    </span>
                    <span className="ml-auto text-[9px] text-white/20 bg-white/[0.05] px-1.5 py-0.5 rounded">
                        {theme === "dark" ? "☀️" : "🌙"}
                    </span>
                </button>

                {/* Language Selector */}
                <div className="relative">
                    <button
                        onClick={() => setLangOpen(!langOpen)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all hover:bg-white/[0.05] group"
                    >
                        <Globe className="w-[18px] h-[18px] text-[#D4AF37]" />
                        <span className="text-white/80 text-[13px] font-semibold group-hover:text-white transition-colors truncate">
                            {languageName}
                        </span>
                        <ChevronDown className={cn(
                            "w-3.5 h-3.5 text-white/30 ml-auto transition-transform",
                            langOpen && "rotate-180"
                        )} />
                    </button>

                    {/* Language Dropdown */}
                    {langOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-full left-0 right-0 mb-1 bg-[#001a3a] border border-white/[0.1] rounded-xl shadow-2xl max-h-[280px] overflow-y-auto custom-scrollbar z-50"
                        >
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setLangOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-4 py-2 text-[12px] hover:bg-white/[0.05] transition-all flex items-center justify-between",
                                        language === lang.code
                                            ? "text-[#D4AF37] font-bold bg-[#D4AF37]/[0.08]"
                                            : "text-white/90"
                                    )}
                                >
                                    <span>{lang.nativeName}</span>
                                    <span className="text-[10px] text-white/50">{lang.name}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>

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
