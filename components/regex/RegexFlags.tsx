"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type RegexFlagId = 'global' | 'caseInsensitive' | 'multiline';

export type FlagState = Record<RegexFlagId, boolean>;

interface RegexFlagConfig {
  id: RegexFlagId;
  label: string;
  description: string;
  flag: string;
}

const regexFlags: RegexFlagConfig[] = [
  {
    id: 'global',
    label: 'Global',
    description: 'Find all matches rather than stopping after the first match',
    flag: 'g'
  },
  {
    id: 'caseInsensitive',
    label: 'Case Insensitive',
    description: 'Make the pattern case-insensitive',
    flag: 'i'
  },
  {
    id: 'multiline',
    label: 'Multiline',
    description: 'Make ^ and $ match the start/end of each line',
    flag: 'm'
  }
];

interface RegexFlagsProps {
  flags: FlagState;
  setFlags: React.Dispatch<React.SetStateAction<FlagState>>;
  pattern: string;
}

export function RegexFlags({ flags, setFlags, pattern }: RegexFlagsProps) {
  const handleFlagChange = (flagId: RegexFlagId) => {
    setFlags(prev => ({
      ...prev,
      [flagId]: !prev[flagId]
    }));
  };

  const activeFlagString = Object.entries(flags)
    .filter(([, value]) => value)
    .map(([key]) => regexFlags.find(f => f.id === key)?.flag)
    .filter((flag): flag is string => flag !== undefined)
    .join('');

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Pattern Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {regexFlags.map((flagOption) => (
            <div
              key={flagOption.id}
              className="flex items-center space-x-2"
            >
              <Switch
                id={flagOption.id}
                checked={flags[flagOption.id]}
                onCheckedChange={() => handleFlagChange(flagOption.id)}
              />
              <div className="flex items-center gap-2">
                <Label htmlFor={flagOption.id} className="font-medium">
                  {flagOption.label}
                </Label>
                <span className="text-xs text-muted-foreground">
                  ({flagOption.flag})
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{flagOption.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}

          {/* Show active flags */}
          <div className="mt-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Active flags:</span>
              <code className="bg-muted px-1 rounded">
                /{pattern}/{activeFlagString}
              </code>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { regexFlags };
