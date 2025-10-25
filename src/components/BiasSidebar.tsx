import { BiasAnalysis, BiasedPhrase } from "@/lib/biasAnalyzer";
import { BiasScore } from "./BiasScore";
import { X, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface BiasSidebarProps {
  analysis: BiasAnalysis | null;
  isOpen: boolean;
  onClose: () => void;
  selectedPhrase: BiasedPhrase | null;
}

export function BiasSidebar({ analysis, isOpen, onClose, selectedPhrase }: BiasSidebarProps) {
  if (!isOpen || !analysis) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-card border-l shadow-2xl animate-slide-in-right z-50">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Analysis Results</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100%-4rem)]">
        <div className="p-4 space-y-6">
          <BiasScore score={analysis.biasScore} />

          <div className="space-y-2">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Summary
            </h3>
            <p className="text-sm leading-relaxed bg-secondary/50 p-4 rounded-lg">
              {analysis.summary}
            </p>
          </div>

          {selectedPhrase && (
            <div className="space-y-2 animate-fade-in">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Selected Phrase
              </h3>
              <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded">
                <p className="font-medium text-sm mb-2">"{selectedPhrase.text}"</p>
                <p className="text-xs text-muted-foreground">{selectedPhrase.explanation}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Flagged Phrases ({analysis.biasedPhrases.length})
            </h3>
            <div className="space-y-2">
              {analysis.biasedPhrases.map((phrase, idx) => {
                const severityColors = {
                  low: "border-l-warning bg-warning/5",
                  medium: "border-l-warning bg-warning/10",
                  high: "border-l-destructive bg-destructive/10"
                };

                return (
                  <div
                    key={idx}
                    className={`border-l-4 ${severityColors[phrase.severity]} p-3 rounded text-sm`}
                  >
                    <p className="font-medium mb-1">"{phrase.text}"</p>
                    <p className="text-xs text-muted-foreground">
                      {phrase.explanation}
                    </p>
                    <span className="text-xs font-medium mt-2 inline-block capitalize">
                      {phrase.severity} severity
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
