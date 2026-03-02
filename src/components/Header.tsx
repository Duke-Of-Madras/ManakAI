"use client";

import { Bell, Search, User } from "lucide-react";

export function Header() {
    return (
        <header className="h-16 bg-white/40 backdrop-blur-md border-b border-white/20 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">

            {/* Logos & Context */}
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    {/* Placeholder for VIT Chennai Logo */}
                    <div className="w-8 h-8 bg-manak-navy/20 rounded border border-manak-navy/30 flex items-center justify-center text-[10px] font-bold text-manak-navy">
                        VIT
                    </div>
                    <div className="h-4 w-[1px] bg-slate-400" />
                    {/* Placeholder for BIS Logo */}
                    <div className="w-8 h-8 bg-manak-gold/20 rounded border border-manak-gold/50 flex items-center justify-center text-[10px] font-bold text-manak-gold">
                        BIS
                    </div>
                </div>

                <div className="text-sm font-semibold text-slate-700 hidden sm:block">
                    Institutional Compliance Command Center
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search regulations..."
                        className="pl-9 pr-4 py-1.5 bg-white/60 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-manak-gold/50 transition-all w-48 sm:w-64"
                    />
                </div>

                <button className="relative p-2 text-slate-500 hover:text-manak-navy transition-colors rounded-full hover:bg-white/50">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                </button>

                <div className="w-8 h-8 bg-manak-navy rounded-full flex items-center justify-center text-white cursor-pointer border-2 border-transparent hover:border-manak-gold transition-colors shadow-sm">
                    <User className="w-4 h-4" />
                </div>
            </div>
        </header>
    );
}
