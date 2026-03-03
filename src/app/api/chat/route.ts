import { NextRequest, NextResponse } from "next/server";
import { textModel } from "@/lib/gemini";
import { searchSimilar } from "@/lib/vectorStore";

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // RAG: retrieve relevant BIS knowledge chunks (keyword search — no API call)
        const relevantChunks = searchSimilar(message, 5);

        const context = relevantChunks.length > 0
            ? relevantChunks
                .map((c) => `[${c.standardCode} — ${c.section}]\n${c.content}`)
                .join("\n\n---\n\n")
            : "No specific standard matched. Use your general knowledge about BIS standards.";

        const prompt = `You are the ManakAI Auditor, an expert AI assistant specializing in Indian Bureau of Indian Standards (BIS) compliance for educational institutions. You are embedded within the ManakAI platform.

Your knowledge covers these standards:
- IS 15700:2018 (Quality Management for Educational Organizations)
- ISO 42001:2023 (AI Management System)
- India AI Sutra 2026 (National AI Ethics & Deployment Guidelines)
- IS 14489:2018 (Lab Safety)
- IS 732:2019 (Electrical Wiring)
- IS 3103:1975 (Industrial Ventilation)

Use the following retrieved knowledge to answer the user's question. Cite specific clause numbers and standard codes when relevant. Be concise but thorough. If the knowledge does not cover the question, say so honestly.

--- RETRIEVED KNOWLEDGE ---
${context}
--- END KNOWLEDGE ---

User Question: ${message}

Respond in a professional, helpful tone. Use bullet points for lists. Keep responses under 300 words.`;

        const result = await textModel.generateContent(prompt);
        const response = result.response.text();

        return NextResponse.json({
            response,
            sources: relevantChunks.map((c) => ({
                standardCode: c.standardCode,
                section: c.section,
            })),
        });
    } catch (error: any) {
        console.error("[Chat API Error]:", error?.message || error);

        if (error?.status === 429 || error?.message?.includes("429")) {
            return NextResponse.json(
                { error: "AI chat quota exceeded for the minute. Please wait 60 seconds and try again." },
                { status: 429 }
            );
        }

        const errMsg = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: `Failed to process your question: ${errMsg}` },
            { status: 500 }
        );
    }
}
