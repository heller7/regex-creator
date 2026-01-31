"use client";

import { Button } from "@/components/ui/button";
import { History, Trash2, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePatternHistory, formatHistoryTimestamp } from "@/hooks/usePatternHistory";
import { useLanguage } from "@/contexts/LanguageContext";
import { labels } from "@/lib/data/labels";
import type { FlagState } from "@/types/regex";

interface PatternHistoryProps {
  onSelectPattern: (pattern: string, flags?: FlagState) => void;
}

export function PatternHistory({ onSelectPattern }: PatternHistoryProps) {
  const { history, mounted, removeFromHistory, clearHistory } = usePatternHistory();
  const { language } = useLanguage();
  const t = labels[language];

  if (!mounted) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <History className="h-3 w-3" />
          {t.patternHistory}
          {history.length > 0 && (
            <span className="ml-1 bg-muted px-1.5 py-0.5 rounded text-[10px]">
              {history.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="flex items-center justify-between p-3 border-b">
          <h4 className="font-medium text-sm">{t.patternHistory}</h4>
          {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive">
                  <Trash2 className="h-3 w-3 mr-1" />
                  {t.clearHistory}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear pattern history?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all {history.length} patterns from your history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearHistory}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Clear All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="max-h-64 overflow-y-auto">
          {history.length > 0 ? (
            <div className="p-1">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-1 group rounded hover:bg-muted"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 justify-start text-xs h-auto py-2 px-2"
                    onClick={() => onSelectPattern(entry.pattern, entry.flags)}
                  >
                    <div className="flex flex-col items-start gap-0.5 w-full overflow-hidden">
                      <code className="text-[11px] font-mono truncate w-full text-left">
                        {entry.pattern}
                      </code>
                      <span className="text-[10px] text-muted-foreground">
                        {formatHistoryTimestamp(entry.timestamp)}
                      </span>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFromHistory(entry.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">
              {t.noHistory}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
