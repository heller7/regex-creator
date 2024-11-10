'use client';

import Link from 'next/link';
import { useLanguage } from 'contexts/LanguageContext';
import type { Language } from 'contexts/LanguageContext';

export function Navigation() {
  const { language, setLanguage, mounted } = useLanguage();

  return (
    <nav className="w-full sticky top-0 z-50 bg-white/75 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-primary hover:text-primary/90 transition-colors">
              Regex Builder
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              About
            </Link>
            {mounted ? (
              <select 
                className="text-sm font-medium border rounded-md px-3 py-1.5 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors cursor-pointer"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                <option value="en">EN</option>
                <option value="de">DE</option>
              </select>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
