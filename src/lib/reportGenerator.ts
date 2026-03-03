import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface BuildingData {
    name: string;
    score: number;
    status: string;
}

interface AuditLogEntry {
    title: string;
    description: string;
    timestamp: string;
    module: string;
    actor: string;
    score?: number;
}

interface ReportData {
    institutionalScore: number;
    infraScore: number;
    academicScore: number;
    governanceScore: number;
    buildings: BuildingData[];
    auditLogs: AuditLogEntry[];
    generatedAt: string;
}

export function generateBISReport(data: ReportData): void {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // ============================================================
    // HEADER
    // ============================================================
    doc.setFillColor(0, 33, 71); // #002147
    doc.rect(0, 0, pageWidth, 45, "F");

    // Gold accent line
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(1);
    doc.line(0, 45, pageWidth, 45);

    doc.setTextColor(212, 175, 55);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("ManakAI", margin, 18);

    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("BIS PROJECT COMPLIANCE-AI", margin, 24);

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("Institutional Quality & Compliance Audit Report", margin, 36);

    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(`Generated: ${data.generatedAt}`, pageWidth - margin, 36, { align: "right" });
    doc.text("VIT Chennai | Bureau of Indian Standards", pageWidth - margin, 41, { align: "right" });

    y = 55;

    // ============================================================
    // EXECUTIVE SUMMARY
    // ============================================================
    doc.setTextColor(0, 33, 71);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("1. Executive Summary", margin, y);
    y += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(
        "This report presents the compliance audit findings for the educational institution as evaluated by the ManakAI",
        margin, y
    );
    y += 5;
    doc.text(
        "platform. The assessment covers infrastructure quality, academic standards, and governance practices aligned with",
        margin, y
    );
    y += 5;
    doc.text(
        "BIS standards including IS 15700:2018, ISO 42001:2023, India AI Sutra 2026, IS 14489:2018, and IS 732:2019.",
        margin, y
    );
    y += 12;

    // ============================================================
    // SCORES TABLE
    // ============================================================
    doc.setTextColor(0, 33, 71);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("2. Institutional Quality Scores", margin, y);
    y += 8;

    autoTable(doc, {
        startY: y,
        head: [["Metric", "Score", "Status", "Benchmark"]],
        body: [
            ["Overall Quality Score", `${data.institutionalScore}/100`, getStatus(data.institutionalScore), "≥ 80"],
            ["Infrastructure Compliance", `${data.infraScore}%`, getStatus(data.infraScore), "≥ 75%"],
            ["Academic Quality", `${data.academicScore}%`, getStatus(data.academicScore), "≥ 80%"],
            ["Governance Adherence", `${data.governanceScore}%`, getStatus(data.governanceScore), "≥ 85%"],
        ],
        theme: "grid",
        headStyles: { fillColor: [0, 33, 71], textColor: [212, 175, 55], fontSize: 9 },
        bodyStyles: { fontSize: 9, textColor: [40, 40, 40] },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { left: margin, right: margin },
        columnStyles: {
            0: { fontStyle: "bold" },
            2: { halign: "center" },
            3: { halign: "center", textColor: [120, 120, 120] },
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 12;

    // ============================================================
    // BUILDING-WISE HEATMAP
    // ============================================================
    doc.setTextColor(0, 33, 71);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("3. Building-wise Compliance Heatmap", margin, y);
    y += 8;

    const buildingRows = data.buildings.map((b) => [
        b.name,
        `${b.score}%`,
        b.status.charAt(0).toUpperCase() + b.status.slice(1),
        b.score >= 85 ? "No action required" : b.score >= 70 ? "Minor improvements needed" : "Immediate remediation required",
    ]);

    autoTable(doc, {
        startY: y,
        head: [["Building", "Score", "Status", "Recommendation"]],
        body: buildingRows,
        theme: "grid",
        headStyles: { fillColor: [0, 33, 71], textColor: [212, 175, 55], fontSize: 9 },
        bodyStyles: { fontSize: 8, textColor: [40, 40, 40] },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { left: margin, right: margin },
        columnStyles: {
            1: { halign: "center" },
            2: { halign: "center" },
        },
        didParseCell: (cellData) => {
            if (cellData.column.index === 2 && cellData.section === "body") {
                const val = String(cellData.cell.raw).toLowerCase();
                if (val === "compliant") cellData.cell.styles.textColor = [16, 185, 129];
                else if (val === "warning") cellData.cell.styles.textColor = [245, 158, 11];
                else cellData.cell.styles.textColor = [239, 68, 68];
            }
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 12;

    // ============================================================
    // STANDARDS REFERENCED
    // ============================================================
    // Check if we need a new page
    if (y > 220) {
        doc.addPage();
        y = 20;
    }

    doc.setTextColor(0, 33, 71);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("4. Standards Referenced", margin, y);
    y += 8;

    autoTable(doc, {
        startY: y,
        head: [["Standard", "Domain", "Compliance Area"]],
        body: [
            ["IS 15700:2018", "Quality Management for Educational Orgs", "Safety, Accessibility, Audits"],
            ["ISO 42001:2023", "AI Management System (AIMS)", "Risk Assessment, Transparency, Data Governance"],
            ["India AI Sutra 2026", "National AI Ethics & Deployment", "Bias Detection, Data Sovereignty, Grievance Redressal"],
            ["IS 14489:2018", "Lab Safety", "Equipment Calibration, PPE, Chemical Storage"],
            ["IS 732:2019", "Electrical Wiring Installations", "Circuit Protection, Earthing, RCD Testing"],
            ["IS 3103:1975", "Industrial Ventilation", "Air Changes/Hour, Exhaust Systems"],
        ],
        theme: "grid",
        headStyles: { fillColor: [0, 33, 71], textColor: [212, 175, 55], fontSize: 9 },
        bodyStyles: { fontSize: 8, textColor: [40, 40, 40] },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { left: margin, right: margin },
        columnStyles: { 0: { fontStyle: "bold" } },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 12;

    // ============================================================
    // AUDIT ACTIVITY LOG
    // ============================================================
    if (y > 220) {
        doc.addPage();
        y = 20;
    }

    doc.setTextColor(0, 33, 71);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("5. Recent Audit Activity", margin, y);
    y += 8;

    const logRows = data.auditLogs.map((log) => [
        log.timestamp,
        log.title,
        log.module,
        log.actor,
        log.score ? `${log.score}%` : "—",
    ]);

    autoTable(doc, {
        startY: y,
        head: [["Timestamp", "Activity", "Module", "Actor", "Score"]],
        body: logRows,
        theme: "grid",
        headStyles: { fillColor: [0, 33, 71], textColor: [212, 175, 55], fontSize: 9 },
        bodyStyles: { fontSize: 8, textColor: [40, 40, 40] },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { left: margin, right: margin },
        columnStyles: { 4: { halign: "center" } },
    });

    // ============================================================
    // FOOTER on every page
    // ============================================================
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const ph = doc.internal.pageSize.getHeight();

        // Gold line
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(0.5);
        doc.line(margin, ph - 15, pageWidth - margin, ph - 15);

        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        doc.text(
            "ManakAI — BIS Project Compliance-AI | VIT Chennai × Bureau of Indian Standards | CONFIDENTIAL",
            margin,
            ph - 10
        );
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, ph - 10, { align: "right" });
    }

    // Save
    const filename = `ManakAI_Audit_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
}

function getStatus(score: number): string {
    if (score >= 85) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Needs Improvement";
    return "Critical";
}
