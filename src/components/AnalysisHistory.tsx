import { BiasAnalysis } from "@/lib/biasAnalyzer";
import { Button } from "./ui/button";
import { Trash2, Clock } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface AnalysisHistoryProps {
  history: BiasAnalysis[];
  onSelect: (analysis: BiasAnalysis) => void;
  onClear: () => void;
}

export function AnalysisHistory({ history, onSelect, onClear }: AnalysisHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No analysis history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Recent Analyses</h3>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {history.map((analysis, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(analysis)}
              className="w-full text-left p-4 bg-card border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg">{analysis.biasScore}/10</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(analysis.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {analysis.summary}
              </p>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
