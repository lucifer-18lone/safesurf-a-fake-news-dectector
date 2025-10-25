import { Shield, AlertTriangle, AlertCircle } from "lucide-react";

interface BiasScoreProps {
  score: number;
}

export function BiasScore({ score }: BiasScoreProps) {
  const getScoreColor = () => {
    if (score < 3) return "text-success";
    if (score < 6) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = () => {
    if (score < 3) return "Low Bias";
    if (score < 6) return "Moderate Bias";
    return "High Bias";
  };

  const getIcon = () => {
    if (score < 3) return <Shield className="w-8 h-8" />;
    if (score < 6) return <AlertTriangle className="w-8 h-8" />;
    return <AlertCircle className="w-8 h-8" />;
  };

  const percentage = (score / 10) * 100;

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg border animate-fade-in">
      <div className={`${getScoreColor()}`}>
        {getIcon()}
      </div>
      
      <div className="text-center">
        <div className="text-4xl font-bold mb-1">{score}/10</div>
        <div className={`text-sm font-medium ${getScoreColor()}`}>
          {getScoreLabel()}
        </div>
      </div>

      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            score < 3 ? "bg-success" : score < 6 ? "bg-warning" : "bg-destructive"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
