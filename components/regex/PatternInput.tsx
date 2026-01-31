"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check, Undo, X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { labels } from "@/lib/data/labels";

interface PatternInputProps {
  pattern: string;
  onChange: (pattern: string) => void;
  isValid: boolean;
  message: string;
  onUndo?: () => void;
  canUndo?: boolean;
}

export function PatternInput({
  pattern,
  onChange,
  isValid,
  message,
  onUndo,
  canUndo = false,
}: PatternInputProps) {
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();
  const t = labels[language];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pattern);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={pattern}
            onChange={(e) => onChange(e.target.value)}
            className={!isValid ? "border-red-500 pr-20" : "pr-20"}
            placeholder={t.enterPattern}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            {pattern && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={handleClear}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t.clearPattern}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleCopy}
                    disabled={!pattern}
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t.copyPattern}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {onUndo && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  onClick={onUndo}
                  disabled={!canUndo}
                  size="icon"
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t.undoAction}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {message && (
        <p className={`text-sm ${isValid ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
