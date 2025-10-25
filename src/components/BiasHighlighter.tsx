import { BiasedPhrase } from "@/lib/biasAnalyzer";
import { useState } from "react";

interface BiasHighlighterProps {
  text: string;
  biasedPhrases: BiasedPhrase[];
  onPhraseClick: (phrase: BiasedPhrase) => void;
}

export function BiasHighlighter({ text, biasedPhrases, onPhraseClick }: BiasHighlighterProps) {
  const [hoveredPhrase, setHoveredPhrase] = useState<BiasedPhrase | null>(null);

  const renderHighlightedText = () => {
    if (biasedPhrases.length === 0) {
      return <p className="whitespace-pre-wrap">{text}</p>;
    }

    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    biasedPhrases.forEach((phrase, idx) => {
      // Add text before the biased phrase
      if (phrase.start > lastIndex) {
        parts.push(
          <span key={`text-${idx}`}>
            {text.slice(lastIndex, phrase.start)}
          </span>
        );
      }

      // Add the highlighted biased phrase
      const severityColors = {
        low: "bg-warning/20 border-warning hover:bg-warning/30",
        medium: "bg-warning/30 border-warning hover:bg-warning/40",
        high: "bg-destructive/30 border-destructive hover:bg-destructive/40"
      };

      parts.push(
        <mark
          key={`phrase-${idx}`}
          className={`${severityColors[phrase.severity]} border-b-2 cursor-pointer transition-colors rounded-sm px-0.5 animate-pulse-highlight`}
          onClick={() => onPhraseClick(phrase)}
          onMouseEnter={() => setHoveredPhrase(phrase)}
          onMouseLeave={() => setHoveredPhrase(null)}
        >
          {phrase.text}
        </mark>
      );

      lastIndex = phrase.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key="text-end">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return <p className="whitespace-pre-wrap leading-relaxed">{parts}</p>;
  };

  return (
    <div className="relative">
      <div className="prose prose-slate max-w-none">
        {renderHighlightedText()}
      </div>
      
      {hoveredPhrase && (
        <div className="fixed z-50 bg-popover border rounded-lg shadow-lg p-3 max-w-xs animate-fade-in pointer-events-none">
          <p className="text-sm text-foreground">{hoveredPhrase.explanation}</p>
        </div>
      )}
    </div>
  );
}
