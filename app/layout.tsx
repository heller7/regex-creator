import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Regex Builder",
  description: "Create and understand regular expressions easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col bg-background">
              <Navigation />
              {children}
              <footer className="w-full py-2 mt-4 text-center bg-muted/50 border-t">
                <p className="text-muted-foreground text-sm">
                  Built with love by Pingu Productions. All rights reserved.
                </p>
              </footer>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
