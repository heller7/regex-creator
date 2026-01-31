"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Info, RefreshCw } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useLanguage } from "@/contexts/LanguageContext";
import { labels } from "@/lib/data/labels";
import { getReplacementReferences } from "@/lib/regex-utils";
import type { ReplacementResult } from "@/types/regex";

interface ReplacementAreaProps {
  replacement: string;
  onReplacementChange: (value: string) => void;
  onReplace: (replaceAll: boolean) => void;
  result: ReplacementResult | null;
  isValid: boolean;
}

export function ReplacementArea({
  replacement,
  onReplacementChange,
  onReplace,
  result,
  isValid,
}: ReplacementAreaProps) {
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const { language } = useLanguage();
  const t = labels[language];

  const handleCopy = async () => {
    if (result?.result) {
      await navigator.clipboard.writeText(result.result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const references = getReplacementReferences();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{t.replacement}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show replacement references</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Replacement reference help */}
        <Collapsible open={showHelp} onOpenChange={setShowHelp}>
          <CollapsibleContent>
            <div className="mb-4 p-3 bg-muted rounded-md text-xs space-y-2">
              <p className="font-medium">Replacement References:</p>
              <div className="grid gap-1">
                {references.map((ref) => (
                  <div key={ref.reference} className="flex items-start gap-2">
                    <code className="bg-background px-1.5 py-0.5 rounded font-mono shrink-0">
                      {ref.reference}
                    </code>
                    <span className="text-muted-foreground">{ref.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Replacement input */}
        <div className="flex gap-2">
          <Input
            value={replacement}
            onChange={(e) => onReplacementChange(e.target.value)}
            placeholder={t.replacementPattern}
            className="font-mono"
          />
        </div>

        {/* Replace buttons */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onReplace(false)}
            disabled={!isValid}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            {t.replaceFirst}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onReplace(true)}
            disabled={!isValid}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            {t.replaceAll}
          </Button>
        </div>

        {/* Result display */}
        {result && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t.replacementResult}:</span>
                {result.success && (
                  <Badge variant="secondary" className="text-xs">
                    {result.replacementCount} replacement{result.replacementCount !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              {result.success && result.result && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy result</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {result.success ? (
              <div className="p-3 bg-muted rounded-md font-mono text-sm whitespace-pre-wrap break-all max-h-32 overflow-y-auto">
                {result.result || '(empty result)'}
              </div>
            ) : (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md text-sm text-red-600 dark:text-red-400">
                {result.error}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
