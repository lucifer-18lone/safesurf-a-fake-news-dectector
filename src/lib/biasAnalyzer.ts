// Mock AI bias analyzer - simulates bias detection
// Ready to be replaced with real AI integration

export interface BiasedPhrase {
  text: string;
  start: number;
  end: number;
  severity: "low" | "medium" | "high";
  explanation: string;
}

export interface BiasAnalysis {
  biasScore: number; // 0-10 scale
  summary: string;
  biasedPhrases: BiasedPhrase[];
  timestamp: number;
}

const biasPatterns = [
  {
    keywords: ["always", "never", "everyone knows", "obviously", "clearly"],
    severity: "medium" as const,
    explanation: "Absolutist language that doesn't allow for nuance or alternative perspectives."
  },
  {
    keywords: ["they say", "people are saying", "many believe", "some claim"],
    severity: "high" as const,
    explanation: "Vague attribution without credible sources, often used to spread unverified claims."
  },
  {
    keywords: ["shocking", "outrageous", "unbelievable", "stunning"],
    severity: "medium" as const,
    explanation: "Emotional language designed to provoke reaction rather than inform."
  },
  {
    keywords: ["proven fact", "undeniable truth", "without question"],
    severity: "high" as const,
    explanation: "Claims of absolute certainty without providing evidence or acknowledging complexity."
  },
  {
    keywords: ["mainstream media", "fake news", "they don't want you to know"],
    severity: "high" as const,
    explanation: "Conspiratorial language that dismisses established sources without evidence."
  }
];

export function analyzeBias(text: string): BiasAnalysis {
  const lowerText = text.toLowerCase();
  const biasedPhrases: BiasedPhrase[] = [];
  
  // Find biased phrases
  biasPatterns.forEach(pattern => {
    pattern.keywords.forEach(keyword => {
      let index = lowerText.indexOf(keyword);
      while (index !== -1) {
        biasedPhrases.push({
          text: text.slice(index, index + keyword.length),
          start: index,
          end: index + keyword.length,
          severity: pattern.severity,
          explanation: pattern.explanation
        });
        index = lowerText.indexOf(keyword, index + 1);
      }
    });
  });

  // Calculate bias score based on findings
  const severityScores = { low: 1, medium: 2, high: 3 };
  const totalSeverity = biasedPhrases.reduce(
    (sum, phrase) => sum + severityScores[phrase.severity],
    0
  );
  const biasScore = Math.min(10, Math.round((totalSeverity / text.length) * 1000));

  // Generate summary
  const summary = generateSummary(text, biasScore, biasedPhrases.length);

  return {
    biasScore,
    summary,
    biasedPhrases: biasedPhrases.sort((a, b) => a.start - b.start),
    timestamp: Date.now()
  };
}

function generateSummary(text: string, biasScore: number, phraseCount: number): string {
  if (biasScore < 3) {
    return "This content appears relatively neutral with minimal detected bias indicators. The language used is generally factual and balanced.";
  } else if (biasScore < 6) {
    return `This content contains ${phraseCount} potential bias indicator${phraseCount !== 1 ? 's' : ''}. Some language may be emotionally charged or lacking proper attribution. Consider verifying claims with additional sources.`;
  } else {
    return `This content shows significant bias indicators with ${phraseCount} flagged phrase${phraseCount !== 1 ? 's' : ''}. The language contains emotional appeals, absolutist statements, or unverified claims. Exercise caution and cross-reference with reliable sources.`;
  }
}
