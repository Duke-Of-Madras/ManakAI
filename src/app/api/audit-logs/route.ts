import { NextResponse } from "next/server";
import { getAllScans } from "@/lib/scan-store";

export async function GET() {
    try {
        const scans = getAllScans();
        const logs = scans.map((scan) => ({
            id: scan.id,
            action: `${scan.placeName} Scan Completed`,
            result: `Compliance score: ${scan.overallScore}% — ${scan.gaps.length} gap(s) found`,
            module: "Vision-Audit",
            user: "System",
            score: scan.overallScore,
            building: scan.buildingName,
            facility: scan.placeName,
            timestamp: scan.timestamp,
        }));
        return NextResponse.json(logs);
    } catch (err: unknown) {
        const error = err as Error;
        console.error("[Audit Logs Error]:", error?.message || error);
        return NextResponse.json({ error: "Failed to load audit logs" }, { status: 500 });
    }
}
