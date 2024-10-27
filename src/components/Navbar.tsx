"use client";

import { Button } from "../../components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const labels = {
  en: {
    title: "Regex Builder",
    switchToDe: "Deutsch",
    switchToEn: "English"
  },
  de: {
    title: "Regex Builder",
    switchToDe: "Deutsch",
    switchToEn: "English"
  }
};

export function Navbar() {
  const { language, setLanguage } = useLanguage();

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">{labels[language].title}</h1>
        <Button 
          className="text-sm"
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
        >
          {language === 'en' ? labels[language].switchToDe : labels[language].switchToEn}
        </Button>
      </div>
    </nav>
  );
}
