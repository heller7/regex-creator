"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Info } from 'lucide-react';
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
import { buildingBlocks, complexPatterns } from "@/lib/data/building-blocks";
import { useLanguage } from "@/contexts/LanguageContext";
import { labels } from "@/lib/data/labels";

interface BuildingBlocksProps {
  onAddBlock: (pattern: string) => void;
}

export function BuildingBlocks({ onAddBlock }: BuildingBlocksProps) {
  const [complexInput, setComplexInput] = useState('');
  const { language } = useLanguage();
  const t = labels[language];

  // Group blocks by category
  const blocksByCategory = {
    character: buildingBlocks.filter(b => b.category === 'character'),
    quantifier: buildingBlocks.filter(b => b.category === 'quantifier'),
    anchor: buildingBlocks.filter(b => b.category === 'anchor'),
    group: buildingBlocks.filter(b => b.category === 'group'),
  };

  const categoryLabels: Record<string, string> = {
    character: 'Character Classes',
    quantifier: 'Quantifiers',
    anchor: 'Anchors',
    group: 'Groups & Classes',
  };

  const handleComplexPattern = (generator: (input: string) => string) => {
    if (complexInput) {
      onAddBlock(generator(complexInput));
      setComplexInput('');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.buildingBlocks}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={['character', 'quantifier']} className="space-y-2">
            {Object.entries(blocksByCategory).map(([category, blocks]) => (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="text-sm font-medium py-2">
                  {categoryLabels[category]}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-1.5 pt-2">
                    {blocks.map((block) => (
                      <div key={block.id} className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 justify-start text-xs h-8 font-normal"
                          onClick={() => onAddBlock(block.pattern)}
                        >
                          <code className="mr-2 text-muted-foreground font-mono">
                            {block.pattern}
                          </code>
                          <span className="truncate">
                            {t[block.name as keyof typeof t] || block.name}
                          </span>
                        </Button>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                                <Info className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <p>{block.info}</p>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.complexBlocks}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={complexInput}
            onChange={(e) => setComplexInput(e.target.value)}
            placeholder={t.customInput}
            className="text-sm"
          />
          <div className="grid grid-cols-1 gap-1.5">
            {complexPatterns.map((pattern) => (
              <div key={pattern.id} className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 justify-start text-xs h-8"
                  onClick={() => handleComplexPattern(pattern.generatePattern)}
                  disabled={!complexInput}
                >
                  {pattern.name}
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                        <Info className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p>{pattern.info}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Example: {pattern.placeholder}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
