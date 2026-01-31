"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Info, Trash2, Save } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { labels } from "@/lib/data/labels";
import type { SavedPattern, FlagState } from "@/types/regex";

interface SavedPatternsProps {
  onSelectPattern: (pattern: string, flags?: FlagState) => void;
  currentPattern: string;
  currentFlags: FlagState;
}

const STORAGE_KEY = 'savedPatterns';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function SavedPatterns({
  onSelectPattern,
  currentPattern,
  currentFlags,
}: SavedPatternsProps) {
  const [savedPatterns, setSavedPatterns] = useState<SavedPattern[]>([]);
  const [patternName, setPatternName] = useState('');
  const [mounted, setMounted] = useState(false);
  const { language } = useLanguage();
  const t = labels[language];

  // Load saved patterns from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Handle both old format (array of {name, pattern}) and new format
          const normalized = parsed.map((p: { id?: string; name: string; pattern: string; flags?: FlagState; createdAt?: string }) => ({
            id: p.id || generateId(),
            name: p.name,
            pattern: p.pattern,
            flags: p.flags || { global: true, caseInsensitive: false, multiline: false },
            createdAt: p.createdAt || new Date().toISOString(),
          }));
          setSavedPatterns(normalized);
        }
      } catch (error) {
        console.error('Failed to load saved patterns:', error);
      }
    }
    setMounted(true);
  }, []);

  // Save patterns to localStorage
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPatterns));
      } catch (error) {
        console.error('Failed to save patterns:', error);
      }
    }
  }, [savedPatterns, mounted]);

  const handleSavePattern = () => {
    if (!currentPattern || !patternName.trim()) return;

    const newPattern: SavedPattern = {
      id: generateId(),
      name: patternName.trim(),
      pattern: currentPattern,
      flags: currentFlags,
      createdAt: new Date().toISOString(),
    };

    setSavedPatterns(prev => [...prev, newPattern]);
    setPatternName('');
  };

  const handleDeletePattern = (id: string) => {
    setSavedPatterns(prev => prev.filter(p => p.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">{t.savedPatterns}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t.savedPatternsInfo}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Save form */}
        <div className="flex gap-2">
          <Input
            value={patternName}
            onChange={(e) => setPatternName(e.target.value)}
            placeholder={t.patternName}
            className="text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && currentPattern && patternName.trim()) {
                handleSavePattern();
              }
            }}
          />
          <Button
            size="sm"
            onClick={handleSavePattern}
            disabled={!currentPattern || !patternName.trim()}
          >
            <Save className="h-3 w-3 mr-1" />
            {t.savePattern}
          </Button>
        </div>

        {/* Saved patterns list */}
        {mounted && savedPatterns.length > 0 ? (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {savedPatterns.map((saved) => (
              <div
                key={saved.id}
                className="flex items-center gap-1 group"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 justify-start text-xs h-8 px-2"
                  onClick={() => onSelectPattern(saved.pattern, saved.flags)}
                >
                  <span className="truncate">{saved.name}</span>
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                        <Info className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <code className="text-xs break-all">{saved.pattern}</code>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.deletePattern}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.confirmDelete}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t.cancelDelete}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeletePattern(saved.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {t.deletePattern}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        ) : mounted ? (
          <p className="text-sm text-muted-foreground text-center py-2">
            {t.noSavedPatterns}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
