"use client";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Sidebar } from "@/components/Sidebar";
import GridBackground from "@/components/GridBackground";

function ThemedLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <>
            <GridBackground />
            <div className="flex h-screen w-full overflow-hidden relative z-10">
                <Sidebar />
                <main
                    className="flex-1 overflow-y-auto backdrop-blur-sm transition-colors duration-300"
                    style={{
                        background: isDark
                            ? "rgba(0, 26, 58, 0.8)"
                            : "rgba(240, 244, 248, 0.95)",
                    }}
                >
                    {children}
                </main>
            </div>
        </>
    );
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <ThemedLayout>{children}</ThemedLayout>
            </LanguageProvider>
        </ThemeProvider>
    );
}
