import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "contexts/LanguageContext";
import { Navigation } from "../components/Navigation";

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
    <html lang="en">
      <body>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <Navigation />
            {children}
            <footer className="w-full py-2 mt-4 text-center bg-gray-100">
              <p className="text-gray-600">
                Built with ❤️ by Pingu Productions. All rights reserved.
              </p>
            </footer>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
