import { BIS_KNOWLEDGE, type KnowledgeChunk } from "@/data/bis-knowledge";

/**
 * Simple keyword-based search over BIS knowledge chunks.
 * No embedding API needed — uses TF-IDF-like scoring for relevance.
 */
export function searchSimilar(query: string, topK: number = 5): KnowledgeChunk[] {
    const queryTerms = tokenize(query);

    const scored = BIS_KNOWLEDGE.map((chunk) => {
        const chunkText = `${chunk.standardCode} ${chunk.section} ${chunk.content}`.toLowerCase();
        let score = 0;

        for (const term of queryTerms) {
            // Exact match in content
            const regex = new RegExp(term, "gi");
            const matches = chunkText.match(regex);
            if (matches) {
                score += matches.length;
            }

            // Bonus for matching standard code exactly
            if (chunk.standardCode.toLowerCase().includes(term)) {
                score += 5;
            }

            // Bonus for matching section name
            if (chunk.section.toLowerCase().includes(term)) {
                score += 3;
            }
        }

        return { chunk, score };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored
        .slice(0, topK)
        .filter((s) => s.score > 0)
        .map((s) => ({
            id: s.chunk.id,
            standardCode: s.chunk.standardCode,
            section: s.chunk.section,
            content: s.chunk.content,
        }));
}

function tokenize(text: string): string[] {
    const stopWords = new Set([
        "the", "is", "at", "which", "on", "a", "an", "and", "or", "but",
        "in", "to", "for", "of", "with", "it", "this", "that", "are", "was",
        "be", "has", "have", "do", "does", "what", "how", "about", "me",
        "tell", "explain", "can", "you", "please", "i", "my",
    ]);

    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length > 1 && !stopWords.has(t));
}
