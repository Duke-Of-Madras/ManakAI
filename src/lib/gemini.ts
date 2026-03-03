import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
}

export const genAI = new GoogleGenerativeAI(apiKey);

// Using gemini-2.5-flash-lite because the user's Google AI profile and IP are aggressively throttled across all other Flash/Pro models.
export const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export const visionModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
