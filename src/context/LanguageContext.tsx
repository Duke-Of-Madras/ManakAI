"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

const INDIAN_LANGUAGES = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
    { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
    { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
    { code: "mai", name: "Maithili", nativeName: "मैथिली" },
    { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्" },
    { code: "ur", name: "Urdu", nativeName: "اردو" },
    { code: "sd", name: "Sindhi", nativeName: "سنڌي" },
    { code: "ne", name: "Nepali", nativeName: "नेपाली" },
    { code: "kok", name: "Konkani", nativeName: "कोंकणी" },
    { code: "doi", name: "Dogri", nativeName: "डोगरी" },
    { code: "mni", name: "Manipuri", nativeName: "মৈতৈলোন্" },
    { code: "sat", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ" },
    { code: "ks", name: "Kashmiri", nativeName: "कॉशुर" },
    { code: "brx", name: "Bodo", nativeName: "बड़ो" },
] as const;

export type LanguageCode = (typeof INDIAN_LANGUAGES)[number]["code"];

interface TranslationCache {
    [key: string]: { [langCode: string]: string };
}

interface LanguageContextType {
    language: LanguageCode;
    languageName: string;
    nativeLanguageName: string;
    setLanguage: (code: LanguageCode) => void;
    languages: typeof INDIAN_LANGUAGES;
    translate: (text: string) => Promise<string>;
    isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
    language: "en",
    languageName: "English",
    nativeLanguageName: "English",
    setLanguage: () => { },
    languages: INDIAN_LANGUAGES,
    translate: async (t) => t,
    isTranslating: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<LanguageCode>("en");
    const [isTranslating, setIsTranslating] = useState(false);
    const [cache] = useState<TranslationCache>({});

    const currentLang = INDIAN_LANGUAGES.find((l) => l.code === language) || INDIAN_LANGUAGES[0];

    const setLanguage = useCallback((code: LanguageCode) => {
        setLanguageState(code);
        localStorage.setItem("manak-language", code);
    }, []);

    const translate = useCallback(
        async (text: string): Promise<string> => {
            if (language === "en" || !text.trim()) return text;

            // Check cache
            const cacheKey = text.substring(0, 100);
            if (cache[cacheKey]?.[language]) {
                return cache[cacheKey][language];
            }

            setIsTranslating(true);
            try {
                const res = await fetch("/api/translate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text, targetLanguage: currentLang.name }),
                });
                const data = await res.json();
                if (data.translated) {
                    if (!cache[cacheKey]) cache[cacheKey] = {};
                    cache[cacheKey][language] = data.translated;
                    return data.translated;
                }
                return text;
            } catch {
                return text;
            } finally {
                setIsTranslating(false);
            }
        },
        [language, currentLang.name, cache]
    );

    return (
        <LanguageContext.Provider
            value={{
                language,
                languageName: currentLang.name,
                nativeLanguageName: currentLang.nativeName,
                setLanguage,
                languages: INDIAN_LANGUAGES,
                translate,
                isTranslating,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);
