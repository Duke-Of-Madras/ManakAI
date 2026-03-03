import { NextRequest, NextResponse } from "next/server";
import { textModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const { text, fileData, fileName } = await req.json();

        const documentText = text || "";

        // If base64 PDF data is provided, send it directly to Gemini as inline data
        // Gemini 2.5 Flash natively understands PDFs — no external library needed
        if (fileData && fileName?.toLowerCase().endsWith(".pdf")) {
            try {
                const prompt = `You are ManakAI's Document Analysis engine. The user has uploaded a PDF document from an educational institution.

First, extract the full readable text content from this PDF, then analyze it for compliance against BIS and national standards.

Evaluate against:
- IS 15700:2018 (Quality Management for Educational Organizations)
- ISO 42001:2023 (AI Management System)
- India AI Sutra 2026 (AI Ethics & Deployment)
- AICTE/UGC curriculum standards

File Name: ${fileName}

You MUST respond with ONLY valid JSON (no markdown, no code blocks, just raw JSON):
{
  "summary": "<2-3 sentence overall assessment>",
  "complianceScore": <number 0-100>,
  "gaps": [
    { "id": "g1", "type": "gap", "title": "<gap title>", "detail": "<explanation>", "clause": "<standard reference>" }
  ],
  "compliant": [
    { "id": "c1", "type": "compliance", "title": "<compliant area>", "detail": "<why it's compliant>", "clause": "<standard reference>" }
  ],
  "upgrades": [
    { "id": "u1", "type": "upgrade", "title": "<upgrade suggestion>", "detail": "<recommendation>", "clause": "<standard reference>" }
  ]
}

Be specific about which standards apply. Provide at least 2 items in each category. Focus on curriculum content, learning outcomes, assessment methods, and institutional practices.`;

                const result = await textModel.generateContent([
                    prompt,
                    {
                        inlineData: {
                            mimeType: "application/pdf",
                            data: fileData,
                        },
                    },
                ]);

                const responseText = result.response.text();

                let parsed;
                try {
                    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        parsed = JSON.parse(jsonMatch[0]);
                    } else {
                        throw new Error("No JSON found in response");
                    }
                } catch {
                    console.error("[Doc Analysis] Failed to parse PDF response:", responseText);
                    return NextResponse.json(
                        { error: "Failed to parse analysis results. Please try again." },
                        { status: 500 }
                    );
                }

                return NextResponse.json(parsed);
            } catch (pdfErr) {
                console.error("[Doc Analysis] PDF analysis error:", pdfErr);
                const errMsg = pdfErr instanceof Error ? pdfErr.message : "Unknown error";
                return NextResponse.json(
                    { error: `Failed to analyze PDF: ${errMsg}` },
                    { status: 500 }
                );
            }
        }

        // For plain text files
        if (!documentText || documentText.trim().length < 10) {
            return NextResponse.json(
                { error: "Could not extract enough text from the document. Try a different file." },
                { status: 400 }
            );
        }

        const truncated = documentText.substring(0, 8000);

        const prompt = `You are ManakAI's Document Analysis engine. Analyze the following document text from an Indian educational institution for compliance against BIS and national standards.

Evaluate against:
- IS 15700:2018 (Quality Management for Educational Organizations)
- ISO 42001:2023 (AI Management System)
- India AI Sutra 2026 (AI Ethics & Deployment)
- AICTE/UGC curriculum standards

File Name: ${fileName || "unknown"}

--- DOCUMENT TEXT ---
${truncated}
--- END ---

You MUST respond with ONLY valid JSON (no markdown, no code blocks, just raw JSON):
{
  "summary": "<2-3 sentence overall assessment>",
  "complianceScore": <number 0-100>,
  "gaps": [
    { "id": "g1", "type": "gap", "title": "<gap title>", "detail": "<explanation>", "clause": "<standard reference>" }
  ],
  "compliant": [
    { "id": "c1", "type": "compliance", "title": "<compliant area>", "detail": "<why it's compliant>", "clause": "<standard reference>" }
  ],
  "upgrades": [
    { "id": "u1", "type": "upgrade", "title": "<upgrade suggestion>", "detail": "<recommendation>", "clause": "<standard reference>" }
  ]
}

Be specific about which standards apply. Provide at least 2 items in each category.`;

        const result = await textModel.generateContent(prompt);
        const responseText = result.response.text();

        let parsed;
        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsed = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON found in response");
            }
        } catch {
            console.error("[Doc Analysis] Failed to parse response:", responseText);
            return NextResponse.json(
                { error: "Failed to parse analysis results. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json(parsed);
    } catch (err: unknown) {
        const error = err as Error & { status?: number };
        console.error("[Doc Analysis Error]:", error?.message || error);

        if (error?.status === 429 || error?.message?.includes("429")) {
            return NextResponse.json(
                { error: "AI analysis quota exceeded for the minute. Please wait 60 seconds and try again." },
                { status: 429 }
            );
        }

        const errMsg = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: `Failed to analyze document: ${errMsg}` },
            { status: 500 }
        );
    }
}
