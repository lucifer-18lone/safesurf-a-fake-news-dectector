import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { analyzeBias, BiasAnalysis, BiasedPhrase } from "@/lib/biasAnalyzer";
import { BiasHighlighter } from "@/components/BiasHighlighter";
import { BiasSidebar } from "@/components/BiasSidebar";
import { AnalysisHistory } from "@/components/AnalysisHistory";
import { Shield, Scan, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "safeguard-analysis-history";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [analyzedText, setAnalyzedText] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<BiasAnalysis | null>(null);
  const [history, setHistory] = useState<BiasAnalysis[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState<BiasedPhrase | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load history:", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history]);

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to analyze",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate processing delay for realistic UX
    setTimeout(() => {
      const analysis = analyzeBias(inputText);
      setCurrentAnalysis(analysis);
      setAnalyzedText(inputText);
      setHistory(prev => [analysis, ...prev].slice(0, 10)); // Keep last 10
      setIsSidebarOpen(true);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: `Found ${analysis.biasedPhrases.length} potential bias indicators.`
      });
    }, 800);
  };

  const handlePhraseClick = (phrase: BiasedPhrase) => {
    setSelectedPhrase(phrase);
    setIsSidebarOpen(true);
  };

  const handleHistorySelect = (analysis: BiasAnalysis) => {
    setCurrentAnalysis(analysis);
    setAnalyzedText(""); // Clear analyzed text for history view
    setIsSidebarOpen(true);
    setSelectedPhrase(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: "History cleared",
      description: "All analysis history has been removed."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SafeSurf</h1>
              <p className="text-sm text-muted-foreground">AI Misinformation Shield</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="analyze" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="analyze" className="flex items-center gap-2">
              <Scan className="w-4 h-4" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6 animate-fade-in">
            <Card className="p-6 max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Analyze Text for Bias</h2>
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste article text, social media post, or any content you want to analyze for bias and misinformation..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <Button 
                  onClick={handleAnalyze} 
                  className="w-full"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="animate-pulse">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      Analyze for Bias
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {currentAnalysis && analyzedText && (
              <Card className="p-6 max-w-4xl mx-auto animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Analysis Results</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  >
                    {isSidebarOpen ? "Hide" : "Show"} Details
                  </Button>
                </div>
                <div className="bg-secondary/30 p-6 rounded-lg">
                  <BiasHighlighter
                    text={analyzedText}
                    biasedPhrases={currentAnalysis.biasedPhrases}
                    onPhraseClick={handlePhraseClick}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Click on highlighted phrases to see explanations
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <Card className="p-6 max-w-4xl mx-auto">
              <AnalysisHistory
                history={history}
                onSelect={handleHistorySelect}
                onClear={handleClearHistory}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BiasSidebar
        analysis={currentAnalysis}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedPhrase={selectedPhrase}
      />
    </div>
  );
};

export default Index;
