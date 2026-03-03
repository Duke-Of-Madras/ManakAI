import { NextRequest, NextResponse } from "next/server";
import { textModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const { text, targetLanguage } = await req.json();

        if (!text || !targetLanguage) {
            return NextResponse.json({ error: "Missing text or targetLanguage" }, { status: 400 });
        }

        // Don't translate if already English
        if (targetLanguage.toLowerCase() === "english") {
            return NextResponse.json({ translated: text });
        }

        const prompt = `Translate the following English text to ${targetLanguage}. 
Return ONLY the translated text, nothing else. Do not add explanations, quotes, or formatting.
Keep technical terms (like "BIS", "IS 15700", "ManakAI", "ISO", "AICTE", "UGC") in their original form.
Keep numbers and percentages as-is.

Text to translate:
${text}`;

        const result = await textModel.generateContent(prompt);
        const translated = result.response.text().trim();

        return NextResponse.json({ translated });
    } catch (error: any) {
        console.error("[Translate API Error]:", error?.message || error);

        // Handle Gemini 429 quota specifically
        if (error?.status === 429 || error?.message?.includes("429")) {
            return NextResponse.json({
                translated: null,
                error: "Translation quota exceeded. Falling back to English.",
                quota_exceeded: true
            }, { status: 429 });
        }

        return NextResponse.json({ error: "Translation failed" }, { status: 500 });
    }
}
