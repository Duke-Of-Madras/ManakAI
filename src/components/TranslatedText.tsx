"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

import { FALLBACK_DICTIONARY } from "@/lib/dictionary";

// Global translation cache (persists across component instances)
const translationCache: Record<string, Record<string, string>> = {};

// ... (keep existing queue logic) ...
// Global queue + debounce for batching translation requests
let pendingQueue: Array<{
    text: string;
    langCode: string;
    langName: string;
    resolve: (val: string) => void;
}> = [];
let batchTimeout: ReturnType<typeof setTimeout> | null = null;

async function processBatch() {
    const batch = [...pendingQueue];
    pendingQueue = [];
    batchTimeout = null;

    if (batch.length === 0) return;

    const langName = batch[0].langName;
    const langCode = batch[0].langCode;

    const separator = " ||| ";
    const combined = batch.map((b) => b.text).join(separator);

    try {
        const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: combined, targetLanguage: langName }),
        });

        if (!res.ok) {
            // If the API hits 429 or 500, immediately fallback to original text safely without crashing
            batch.forEach((item) => item.resolve(item.text));
            return;
        }

        const data = await res.json();

        if (data.translated && !data.error) {
            const parts = data.translated.split(separator.trim());
            batch.forEach((item, i) => {
                const translated = (parts[i] || item.text).trim();
                if (!translationCache[langCode]) translationCache[langCode] = {};
                translationCache[langCode][item.text] = translated;
                item.resolve(translated);
            });
        } else {
            batch.forEach((item) => item.resolve(item.text));
        }
    } catch {
        batch.forEach((item) => item.resolve(item.text));
    }
}

function queueTranslation(text: string, langCode: string, langName: string): Promise<string> {
    if (translationCache[langCode]?.[text]) {
        return Promise.resolve(translationCache[langCode][text]);
    }

    return new Promise((resolve) => {
        pendingQueue.push({ text, langCode, langName, resolve });
        if (batchTimeout) clearTimeout(batchTimeout);
        batchTimeout = setTimeout(processBatch, 100);
    });
}

/**
 * <T> — Auto-translating text component.
 * Batches multiple translation requests into a single API call.
 */
export function T({ children }: { children: string }) {
    const { language, languageName } = useLanguage();
    const [text, setText] = useState(children);
    const mountedRef = useRef(true);

    const doTranslate = useCallback(async () => {
        if (language === "en") {
            setText(children);
            return;
        }

        // 1. Check static fallback dictionary FIRST (Zero API cost)
        if (FALLBACK_DICTIONARY[language]?.[children]) {
            setText(FALLBACK_DICTIONARY[language][children]);
            return;
        }

        // 2. Check memory cache
        if (translationCache[language]?.[children]) {
            setText(translationCache[language][children]);
            return;
        }

        // 3. Check localStorage cache 
        try {
            const lsKey = `manak-trans-${language}`;
            const stored = localStorage.getItem(lsKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed[children]) {
                    if (!translationCache[language]) translationCache[language] = {};
                    translationCache[language][children] = parsed[children];
                    setText(parsed[children]);
                    return;
                }
            }
        } catch { /* ignore ls errors */ }

        const result = await queueTranslation(children, language, languageName);
        if (mountedRef.current) {
            setText(result);

            // Save to localStorage
            try {
                const lsKey = `manak-trans-${language}`;
                const stored = localStorage.getItem(lsKey);
                const parsed = stored ? JSON.parse(stored) : {};
                parsed[children] = result;
                localStorage.setItem(lsKey, JSON.stringify(parsed));
            } catch { /* ignore ls errors */ }
        }
    }, [children, language, languageName]);

    useEffect(() => {
        mountedRef.current = true;
        doTranslate();
        return () => { mountedRef.current = false; };
    }, [doTranslate]);

    return <>{text}</>;
}
