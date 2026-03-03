import { NextRequest, NextResponse } from "next/server";
import { visionModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json();

        if (!image || typeof image !== "string") {
            return NextResponse.json({ error: "Base64 image is required" }, { status: 400 });
        }

        // Extract base64 data (remove data URI prefix if present)
        const base64Data = image.includes(",") ? image.split(",")[1] : image;
        const mimeType = image.startsWith("data:image/png") ? "image/png" : "image/jpeg";

        const prompt = `You are ManakAI's Vision-Audit engine. Analyze this infrastructure image for BIS compliance in an Indian educational institution context.

Evaluate against these standards:
- IS 15700:2018 (safety signage, fire exits, accessibility, emergency maps)
- IS 732:2019 (electrical wiring, circuit protection, earthing)
- IS 3103:1975 (ventilation, air quality)
- IS 14489:2018 (lab equipment calibration, PPE, chemical storage)

You MUST respond with ONLY valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "overallScore": <number 0-100>,
  "summary": "<one sentence overall assessment>",
  "tags": [
    { "label": "<short tag name>", "status": "pass" | "fail" | "warning", "clause": "<standard clause reference>" }
  ],
  "gaps": [
    { "title": "<gap title>", "clause": "<standard and clause number>", "severity": "high" | "medium" | "low", "location": "<where in image>", "recommendation": "<fix action>" }
  ]
}

Be specific. If you can identify structural, safety, electrical, or accessibility issues, list them. If the image is unclear or not infrastructure-related, still provide your best assessment with appropriate scores. Always return at least 2 tags and 1 gap.`;

        const result = await visionModel.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType,
                    data: base64Data,
                },
            },
        ]);

        const responseText = result.response.text();

        // Parse JSON from response (handle potential markdown wrapping)
        let parsed;
        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsed = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("No JSON found in response");
            }
        } catch {
            console.error("[Vision API] Failed to parse response:", responseText);
            return NextResponse.json(
                { error: "Failed to parse analysis. Please try a different image." },
                { status: 500 }
            );
        }

        return NextResponse.json(parsed);
    } catch (error: any) {
        console.error("[Vision API Error]:", error?.message || error);

        if (error?.status === 429 || error?.message?.includes("429")) {
            return NextResponse.json(
                { error: "AI vision quota exceeded for the minute. Please wait 60 seconds and try again." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: "Failed to analyze image. Please try again." },
            { status: 500 }
        );
    }
}
