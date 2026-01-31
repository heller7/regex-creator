"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, Copy, Check } from 'lucide-react';
import { generateCode, getExportLanguages } from "@/lib/regex-export";
import { useLanguage } from "@/contexts/LanguageContext";
import { labels } from "@/lib/data/labels";
import type { ExportLanguage, FlagState } from "@/types/regex";

interface ExportModalProps {
  pattern: string;
  flags: FlagState;
  testString?: string;
  replacement?: string;
}

export function ExportModal({
  pattern,
  flags,
  testString,
  replacement,
}: ExportModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<ExportLanguage>('javascript');
  const [includeTest, setIncludeTest] = useState(true);
  const [includeReplacement, setIncludeReplacement] = useState(!!replacement);
  const [copied, setCopied] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const { language } = useLanguage();
  const t = labels[language];

  const languages = getExportLanguages();

  // Generate code when options change
  useEffect(() => {
    if (!pattern) {
      setGeneratedCode('// No pattern to export');
      return;
    }

    const result = generateCode({
      language: selectedLanguage,
      pattern,
      flags,
      testString: includeTest ? testString : undefined,
      replacement: includeReplacement ? replacement : undefined,
      includeTest,
      includeReplacement,
    });

    setGeneratedCode(result.code);
  }, [selectedLanguage, pattern, flags, testString, replacement, includeTest, includeReplacement]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const result = generateCode({
      language: selectedLanguage,
      pattern,
      flags,
      testString: includeTest ? testString : undefined,
      replacement: includeReplacement ? replacement : undefined,
      includeTest,
      includeReplacement,
    });

    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!pattern}>
          <Download className="h-3 w-3 mr-1" />
          {t.exportCode}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{t.exportCode}</DialogTitle>
          <DialogDescription>
            Export your regex pattern as code in your preferred language.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Options */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="language-select">{t.selectLanguage}:</Label>
              <Select
                value={selectedLanguage}
                onValueChange={(value) => setSelectedLanguage(value as ExportLanguage)}
              >
                <SelectTrigger id="language-select" className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="include-test"
                checked={includeTest}
                onCheckedChange={setIncludeTest}
                disabled={!testString}
              />
              <Label htmlFor="include-test" className="text-sm">
                Include test code
              </Label>
            </div>

            {replacement && (
              <div className="flex items-center gap-2">
                <Switch
                  id="include-replacement"
                  checked={includeReplacement}
                  onCheckedChange={setIncludeReplacement}
                />
                <Label htmlFor="include-replacement" className="text-sm">
                  Include replacement
                </Label>
              </div>
            )}
          </div>

          {/* Code preview */}
          <div className="flex-1 min-h-0 overflow-hidden rounded-md border bg-muted">
            <div className="flex items-center justify-between px-3 py-2 border-b bg-background">
              <span className="text-sm font-medium">
                {languages.find(l => l.id === selectedLanguage)?.name}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-7"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1 text-green-500" />
                      {t.codeCopied}
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      {t.copyCode}
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="h-7"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <pre className="p-4 text-sm font-mono overflow-auto h-[300px]">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
