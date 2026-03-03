import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/scan-store";

export async function GET() {
    try {
        const stats = getDashboardStats();
        return NextResponse.json(stats);
    } catch (err: unknown) {
        const error = err as Error;
        console.error("[Dashboard Stats Error]:", error?.message || error);
        return NextResponse.json({ error: "Failed to load dashboard stats" }, { status: 500 });
    }
}
