"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Info, Search } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { commonPatternCategories, searchPatterns } from "@/lib/data/common-patterns";
import { useLanguage } from "@/contexts/LanguageContext";
import { labels } from "@/lib/data/labels";

interface CommonPatternsProps {
  onSelectPattern: (pattern: string) => void;
}

export function CommonPatterns({ onSelectPattern }: CommonPatternsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();
  const t = labels[language];

  const filteredCategories = searchQuery
    ? [{
        name: 'Search Results',
        category: 'validation' as const,
        patterns: searchPatterns(searchQuery),
      }]
    : commonPatternCategories;

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t.commonPatterns}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patterns..."
            className="pl-8 text-sm"
          />
        </div>

        <Accordion type="single" collapsible className="space-y-1">
          {filteredCategories.map((category, index) => (
            <AccordionItem key={index} value={`category-${index}`}>
              <AccordionTrigger className="text-sm font-medium py-2">
                <span className="flex items-center gap-2">
                  {category.name}
                  <Badge variant="secondary" className="text-[10px] h-4">
                    {category.patterns.length}
                  </Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 pt-1">
                  {category.patterns.map((pattern) => (
                    <div
                      key={pattern.id}
                      className="flex items-center gap-1"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 justify-start text-xs h-auto py-1.5 px-2"
                        onClick={() => onSelectPattern(pattern.pattern)}
                      >
                        <div className="flex flex-col items-start gap-0.5 w-full">
                          <span className="font-medium">{pattern.id}</span>
                          {pattern.difficulty && (
                            <Badge
                              variant="outline"
                              className={`text-[9px] h-4 ${getDifficultyColor(pattern.difficulty)}`}
                            >
                              {pattern.difficulty}
                            </Badge>
                          )}
                        </div>
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                              <Info className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-sm">
                            <div className="space-y-1">
                              <p className="font-medium">{pattern.description}</p>
                              <code className="block text-xs bg-muted p-1 rounded break-all">
                                {pattern.pattern}
                              </code>
                              {pattern.example && (
                                <p className="text-xs text-muted-foreground">
                                  Example: {pattern.example}
                                </p>
                              )}
                              {pattern.tags && pattern.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {pattern.tags.map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-[9px] h-4"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {searchQuery && filteredCategories[0]?.patterns.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No patterns found for &quot;{searchQuery}&quot;
          </p>
        )}
      </CardContent>
    </Card>
  );
}
