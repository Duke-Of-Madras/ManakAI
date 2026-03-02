"use client";

import { AlertCircle, FileWarning, ArrowRight, CheckCircle } from "lucide-react";

interface GapSidebarProps {
    clauseReference: string;
    recommendedUpgrade: string;
    status: "passed" | "warning" | "failed";
}

export function GapSidebar({ clauseReference, recommendedUpgrade, status }: GapSidebarProps) {
    const isGood = status === "passed";

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <FileWarning className="w-5 h-5 text-manak-navy" />
                <h3 className="font-bold text-manak-navy text-sm">Detected Issues & Gaps</h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                <div className={`p-4 rounded-lg border flex items-start gap-3 ${isGood ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    {isGood ? <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" /> : <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />}
                    <div>
                        <h4 className="text-sm font-bold mb-1">{clauseReference}</h4>
                        <p className="text-xs opacity-90 leading-relaxed mb-3">
                            {recommendedUpgrade}
                        </p>

                        {!isGood && (
                            <button className="flex items-center text-xs font-bold gap-1 bg-white px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 hover:shadow-sm transition-all">
                                Remediate Action
                                <ArrowRight className="w-3 h-3 ml-1" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Dummy previous logs */}
                <div className="mt-8">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Previous Audits</h4>
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex flex-col p-3 rounded-lg border border-slate-100 bg-slate-50 relative group">
                                <span className="text-xs font-medium text-slate-600">IS 15700 Clause 4.1</span>
                                <span className="text-[10px] text-slate-400 mt-1">Resolved on Oct 12, 2025</span>
                                <div className="absolute top-1/2 -translate-y-1/2 right-3 w-2 h-2 bg-green-400 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
