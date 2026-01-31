"use client";

import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { labels } from "@/lib/data/labels";
import type { EnhancedMatchResult } from "@/types/regex";

interface MatchesDisplayProps {
  matches: EnhancedMatchResult[];
}

export function MatchesDisplay({ matches }: MatchesDisplayProps) {
  const { language } = useLanguage();
  const t = labels[language];

  if (matches.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-muted rounded-md space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{t.matches}:</h2>
        <Badge variant="secondary">{matches.length} match{matches.length !== 1 ? 'es' : ''}</Badge>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {matches.map((match, index) => (
          <div
            key={index}
            className="p-3 bg-background rounded-md border space-y-2"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">#{index + 1}</Badge>
              <code className="font-mono bg-muted px-2 py-1 rounded text-sm break-all">
                {match.text || '(empty match)'}
              </code>
              <span className="text-xs text-muted-foreground">
                {t.matchPosition
                  .replace('{start}', String(match.start))
                  .replace('{end}', String(match.end))}
              </span>
            </div>

            {/* Capture Groups */}
            {match.captureGroups && match.captureGroups.length > 0 && (
              <div className="pl-4 border-l-2 border-muted space-y-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {t.captureGroups}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {match.captureGroups.map((group, groupIndex) => (
                    <div
                      key={groupIndex}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Badge
                        variant="secondary"
                        className="h-5 text-[10px]"
                      >
                        {group.name ? `$<${group.name}>` : `$${group.index}`}
                      </Badge>
                      <code className="bg-muted px-1.5 py-0.5 rounded">
                        {group.value || '(empty)'}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Named Groups from match.groups */}
            {match.groups && Object.keys(match.groups).length > 0 && (
              <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800 space-y-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Named Groups:
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(match.groups).map(([name, value]) => (
                    <div key={name} className="flex items-center gap-1 text-xs">
                      <Badge variant="outline" className="h-5 text-[10px]">
                        {name}
                      </Badge>
                      <code className="bg-muted px-1.5 py-0.5 rounded">
                        {value || '(empty)'}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
