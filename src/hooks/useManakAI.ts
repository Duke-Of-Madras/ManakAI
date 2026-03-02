"use client";

import { useState, useEffect, useCallback } from "react";

// --- Types ---
export interface BuildingStatus {
    id: string;
    name: string;
    score: number;
    status: "compliant" | "warning" | "critical";
}

export interface AuditFeedItem {
    id: string;
    timestamp: string;
    message: string;
    type: "scan" | "report" | "alert" | "system";
}

export interface InfraGap {
    id: string;
    title: string;
    clause: string;
    severity: "high" | "medium" | "low";
    location: string;
}

export interface BISStandard {
    id: string;
    code: string;
    title: string;
    category: string;
    description: string;
    mandatoryRequirements: string[];
    lastUpdated: string;
}

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    action: string;
    module: string;
    result: string;
    score?: number;
    user: string;
}

export interface ManakAIData {
    institutionalScore: number;
    infraScore: number;
    academicScore: number;
    governanceScore: number;
    buildings: BuildingStatus[];
    auditFeed: AuditFeedItem[];
    infraGaps: InfraGap[];
    bisStandards: BISStandard[];
    auditLogs: AuditLogEntry[];
    isLive: boolean;
}

// --- Mock Data ---
const BUILDINGS: BuildingStatus[] = [
    { id: "b1", name: "Main Block", score: 94, status: "compliant" },
    { id: "b2", name: "Lab Complex A", score: 88, status: "compliant" },
    { id: "b3", name: "Lab Complex B", score: 72, status: "warning" },
    { id: "b4", name: "Library Tower", score: 96, status: "compliant" },
    { id: "b5", name: "Admin Block", score: 91, status: "compliant" },
    { id: "b6", name: "Workshop Wing", score: 58, status: "critical" },
    { id: "b7", name: "Hostel Block 1", score: 83, status: "compliant" },
    { id: "b8", name: "Hostel Block 2", score: 67, status: "warning" },
    { id: "b9", name: "Sports Complex", score: 79, status: "warning" },
    { id: "b10", name: "Cafeteria", score: 85, status: "compliant" },
    { id: "b11", name: "Research Center", score: 92, status: "compliant" },
    { id: "b12", name: "Placement Cell", score: 90, status: "compliant" },
];

const FEED_MESSAGES = [
    { message: "Lab 601 Scan Completed — Score 88%", type: "scan" as const },
    { message: "Safety Audit triggered for Workshop Wing", type: "alert" as const },
    { message: "BIS IS 15700 compliance check passed for Main Block", type: "report" as const },
    { message: "New India AI Sutra 2026 guideline synced", type: "system" as const },
    { message: "Hostel Block 2 — Fire Exit mapping updated", type: "scan" as const },
    { message: "Governance audit for Admin Block completed", type: "report" as const },
    { message: "Critical: Workshop Wing safety signage non-compliant", type: "alert" as const },
    { message: "ISO 42001 AI Management System check initiated", type: "system" as const },
    { message: "Research Center calibration audit — Score 92%", type: "scan" as const },
    { message: "Document IS 14489 cross-referenced for Cafeteria", type: "report" as const },
];

const INFRA_GAPS: InfraGap[] = [
    { id: "g1", title: "Inadequate Fire Safety Signage", clause: "IS 15700:2018 Clause 5.2", severity: "high", location: "Workshop Wing" },
    { id: "g2", title: "Missing Emergency Evacuation Map", clause: "IS 15700:2018 Clause 7.4", severity: "high", location: "Hostel Block 2" },
    { id: "g3", title: "Outdated Lab Equipment Calibration", clause: "IS 14489:2018 Sec 4.2", severity: "medium", location: "Lab Complex B" },
    { id: "g4", title: "Insufficient Ventilation Standards", clause: "IS 3103:1975 Clause 3.1", severity: "medium", location: "Workshop Wing" },
    { id: "g5", title: "Non-compliant Electrical Wiring", clause: "IS 732:2019 Clause 6.3", severity: "high", location: "Sports Complex" },
    { id: "g6", title: "ADA Accessibility Ramp Missing", clause: "IS 15700:2018 Clause 9.1", severity: "low", location: "Library Tower" },
];

const BIS_STANDARDS: BISStandard[] = [
    {
        id: "s1", code: "IS 15700:2018", title: "Quality Management for Educational Organizations",
        category: "Education", description: "Specifies requirements for a quality management system specific to educational organizations.",
        mandatoryRequirements: [
            "Safety infrastructure including fire exits and signage (Clause 5.2)",
            "Emergency evacuation procedures and maps (Clause 7.4)",
            "Accessibility compliance for persons with disabilities (Clause 9.1)",
            "Periodic quality audits and self-assessment (Clause 10.3)",
        ],
        lastUpdated: "2024-06-15",
    },
    {
        id: "s2", code: "ISO 42001:2023", title: "AI Management System (AIMS)",
        category: "AI Governance", description: "International standard for establishing, implementing, and maintaining an AI management system.",
        mandatoryRequirements: [
            "AI risk assessment and mitigation framework (Clause 6.1)",
            "Transparency and explainability of AI systems (Clause 7.2)",
            "Data governance and ethical AI use policies (Clause 8.4)",
            "Continuous monitoring and improvement of AI systems (Clause 10.1)",
        ],
        lastUpdated: "2024-01-20",
    },
    {
        id: "s3", code: "India AI Sutra 2026", title: "National AI Ethics & Deployment Guidelines",
        category: "AI Policy", description: "India's comprehensive framework for responsible AI deployment in public institutions, mandating transparency, safety, and inclusivity.",
        mandatoryRequirements: [
            "Mandatory AI Impact Assessment for all government deployments (Sutra 3.1)",
            "Indigenous language support in all AI interfaces (Sutra 4.2)",
            "Bias detection and fairness auditing pipeline (Sutra 5.3)",
            "Data sovereignty compliance — all data processed within Indian borders (Sutra 6.1)",
            "Grievance redressal mechanism for AI-driven decisions (Sutra 7.4)",
        ],
        lastUpdated: "2026-01-15",
    },
    {
        id: "s4", code: "IS 14489:2018", title: "Occupational Health & Safety in Laboratories",
        category: "Safety", description: "Requirements for occupational health and safety management in laboratory environments.",
        mandatoryRequirements: [
            "Chemical storage and handling protocols (Sec 3.1)",
            "Equipment calibration schedules (Sec 4.2)",
            "Personal protective equipment standards (Sec 5.1)",
            "Ventilation and air quality monitoring (Sec 6.3)",
        ],
        lastUpdated: "2023-09-10",
    },
    {
        id: "s5", code: "IS 732:2019", title: "Code of Practice for Electrical Wiring Installations",
        category: "Electrical Safety", description: "National standard for safe electrical wiring installations in buildings.",
        mandatoryRequirements: [
            "Standard wire gauge and insulation requirements (Clause 4.1)",
            "Earthing and grounding specifications (Clause 5.2)",
            "Circuit breaker and safety switch compliance (Clause 6.3)",
            "Periodic inspection and testing schedule (Clause 8.1)",
        ],
        lastUpdated: "2024-03-01",
    },
    {
        id: "s6", code: "IS 3103:1975", title: "Code of Practice for Industrial Ventilation",
        category: "Infrastructure", description: "Guidelines for ventilation systems in industrial and institutional buildings.",
        mandatoryRequirements: [
            "Minimum air changes per hour (Clause 3.1)",
            "Exhaust system specifications for hazardous areas (Clause 4.2)",
            "Natural ventilation openings requirements (Clause 5.1)",
        ],
        lastUpdated: "2022-11-20",
    },
];

const AUDIT_LOGS: AuditLogEntry[] = [
    { id: "l1", timestamp: "2026-03-02 19:45:12", action: "Vision Scan Completed", module: "Vision-Audit", result: "3 gaps identified", score: 88, user: "System" },
    { id: "l2", timestamp: "2026-03-02 18:30:00", action: "BIS-Ready Report Generated", module: "Reports", result: "PDF exported successfully", user: "Dr. Sharma" },
    { id: "l3", timestamp: "2026-03-02 17:15:44", action: "Standards Wiki Updated", module: "Standards Wiki", result: "India AI Sutra 2026 synced", user: "System" },
    { id: "l4", timestamp: "2026-03-02 16:00:22", action: "Document Analysis Run", module: "Document Analysis", result: "2 skill gaps found in CS syllabus", user: "Prof. Iyer" },
    { id: "l5", timestamp: "2026-03-02 14:30:11", action: "Governance Audit Completed", module: "Dashboard", result: "Score: 91%", score: 91, user: "System" },
    { id: "l6", timestamp: "2026-03-02 12:00:05", action: "Lab Complex B Inspection", module: "Vision-Audit", result: "Calibration gap flagged", score: 72, user: "Lab Admin" },
    { id: "l7", timestamp: "2026-03-01 22:00:00", action: "Nightly Compliance Sync", module: "System", result: "All BIS databases updated", user: "System" },
    { id: "l8", timestamp: "2026-03-01 16:45:33", action: "Workshop Wing Alert Raised", module: "Vision-Audit", result: "Critical safety non-compliance", score: 58, user: "System" },
];

// Pre-built initial feed to avoid empty state on hydration
const INITIAL_FEED: AuditFeedItem[] = [
    { id: "init-1", timestamp: "21:12:05", message: "Lab 601 Scan Completed \u2014 Score 88%", type: "scan" },
    { id: "init-2", timestamp: "21:11:42", message: "Safety Audit triggered for Workshop Wing", type: "alert" },
    { id: "init-3", timestamp: "21:10:15", message: "BIS IS 15700 compliance check passed for Main Block", type: "report" },
    { id: "init-4", timestamp: "21:09:33", message: "New India AI Sutra 2026 guideline synced", type: "system" },
    { id: "init-5", timestamp: "21:08:01", message: "Hostel Block 2 \u2014 Fire Exit mapping updated", type: "scan" },
    { id: "init-6", timestamp: "21:06:44", message: "Governance audit for Admin Block completed", type: "report" },
    { id: "init-7", timestamp: "21:05:11", message: "Critical: Workshop Wing safety signage non-compliant", type: "alert" },
    { id: "init-8", timestamp: "21:03:28", message: "ISO 42001 AI Management System check initiated", type: "system" },
];

// --- Hook ---
export function useManakAI(): ManakAIData {
    const [data, setData] = useState<ManakAIData>({
        institutionalScore: 84,
        infraScore: 79,
        academicScore: 88,
        governanceScore: 91,
        buildings: BUILDINGS,
        auditFeed: INITIAL_FEED,
        infraGaps: INFRA_GAPS,
        bisStandards: BIS_STANDARDS,
        auditLogs: AUDIT_LOGS,
        isLive: true,
    });

    // Generate a feed item
    const generateFeedItem = useCallback((): AuditFeedItem => {
        const template = FEED_MESSAGES[Math.floor(Math.random() * FEED_MESSAGES.length)];
        const now = new Date();
        return {
            id: `feed-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            timestamp: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            message: template.message,
            type: template.type,
        };
    }, []);

    // Live updates every 30 seconds (no separate initialization needed)

    // Live updates every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setData((prev) => {
                const jitter = (base: number) => Math.max(0, Math.min(100, base + (Math.random() - 0.5) * 4));
                const newFeed = [generateFeedItem(), ...prev.auditFeed.slice(0, 19)];
                return {
                    ...prev,
                    institutionalScore: Math.round(jitter(prev.institutionalScore)),
                    infraScore: Math.round(jitter(prev.infraScore)),
                    academicScore: Math.round(jitter(prev.academicScore)),
                    governanceScore: Math.round(jitter(prev.governanceScore)),
                    auditFeed: newFeed,
                };
            });
        }, 30000);
        return () => clearInterval(interval);
    }, [generateFeedItem]);

    return data;
}
