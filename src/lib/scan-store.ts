import fs from "fs";
import path from "path";

export interface ScanResult {
    id: string;
    buildingName: string;
    placeName: string;
    overallScore: number;
    summary: string;
    tags: { label: string; status: "pass" | "fail" | "warning"; clause: string }[];
    gaps: { title: string; clause: string; severity: "high" | "medium" | "low"; location: string; recommendation: string }[];
    timestamp: string;
    filename?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const SCANS_FILE = path.join(DATA_DIR, "scans.json");

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SCANS_FILE)) {
        fs.writeFileSync(SCANS_FILE, "[]", "utf-8");
    }
}

export function getAllScans(): ScanResult[] {
    ensureDataDir();
    try {
        const raw = fs.readFileSync(SCANS_FILE, "utf-8");
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

export function saveScan(scan: ScanResult): ScanResult {
    ensureDataDir();
    const scans = getAllScans();
    scans.unshift(scan); // newest first
    fs.writeFileSync(SCANS_FILE, JSON.stringify(scans, null, 2), "utf-8");
    return scan;
}

export function getDashboardStats() {
    const scans = getAllScans();
    const totalScans = scans.length;

    // Overall average
    const overallAvg = totalScans > 0
        ? Math.round(scans.reduce((sum, s) => sum + s.overallScore, 0) / totalScans)
        : 0;

    // Per-building aggregation
    const buildingMap = new Map<string, { totalScore: number; count: number }>();
    for (const scan of scans) {
        const key = scan.buildingName || "Unknown Building";
        const existing = buildingMap.get(key) || { totalScore: 0, count: 0 };
        existing.totalScore += scan.overallScore;
        existing.count += 1;
        buildingMap.set(key, existing);
    }

    const heatmap = Array.from(buildingMap.entries()).map(([building, data]) => ({
        building,
        score: Math.round(data.totalScore / data.count),
        scans: data.count,
        status: Math.round(data.totalScore / data.count) >= 80 ? "compliant" as const
            : Math.round(data.totalScore / data.count) >= 60 ? "warning" as const
                : "critical" as const,
    }));

    // Recent 10 for the audit feed
    const auditFeed = scans.slice(0, 10).map((scan) => ({
        id: scan.id,
        timestamp: new Date(scan.timestamp).toLocaleTimeString("en-IN", { hour12: false }),
        message: `${scan.buildingName} — ${scan.placeName} scan completed — Score ${scan.overallScore}%`,
        type: "scan" as const,
    }));

    return { overallAvg, totalScans, heatmap, auditFeed, scans };
}
