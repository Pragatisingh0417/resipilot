import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

export default function SmartMatchingPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [families, setFamilies] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  // ✅ Load real DB data
  useEffect(() => {
    const loadData = async () => {
      try {
        const c = await api.get("/children");
        const f = await api.get("/foster-families");

        setChildren(c.data || []);
        setFamilies(f.data || []);
      } catch (err) {
        console.error("DB load error:", err);
      }
    };

    loadData();
  }, []);

  // ✅ Run AI Matching
  const runMatching = async () => {
    if (!children.length || !families.length) {
      alert("No children or families data available");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/ai/match", {
        children,
        families
      });

      setResults(res.results || []);
    } catch (err) {
      console.error("Matching error:", err);
      alert("AI matching failed");
    }

    setLoading(false);
  };

  // ✅ Accept Match
  const acceptMatch = async (caseId: string, match: any) => {
    try {
      await api.post("/cases/accept-match", {
        caseId,
        match
      });

      alert("Match accepted ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to accept match");
    }
  };

  return (
    <div>
      <PageHeader
        title="Smart Matching"
        description="AI-powered child-to-family matching"
        actions={
          <Button size="sm" onClick={runMatching} disabled={loading}>
            <Brain className="h-4 w-4 mr-1" />
            {loading ? "Running..." : "Run Matching"}
          </Button>
        }
      />

      <div className="p-6 space-y-6">

        {/* EMPTY STATE */}
        {!loading && results.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Click "Run Matching" to generate AI-powered matches.
          </p>
        )}

        {/* LOADING */}
        {loading && (
          <p className="text-sm text-muted-foreground">
            AI is analyzing children and families...
          </p>
        )}

        {/* RESULTS */}
        {results.map((r, i) => (
          <div key={i}>
            <h2 className="font-bold text-lg mb-4">
              {r.child}
            </h2>

            {r.matches?.map((m: any, j: number) => {
              const key = `${i}-${j}`;
              const isOpen = openIndex === key;

              return (
                <Card key={j} className="mb-4">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">

                      {/* LEFT SIDE */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <span className="font-semibold">{r.child}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{m.family}</span>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            {m.explanation}
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {m.factors?.map((f: string, k: number) => (
                              <Badge key={k} variant="secondary" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {f}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="text-right ml-6">
                        <div
                          className={`text-2xl font-bold ${
                            m.score >= 90
                              ? "text-green-600"
                              : m.score >= 80
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {m.score}%
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Match Score
                        </p>

                        <p className="text-xs mt-1 text-muted-foreground">
                          Confidence: {m.confidence}%
                        </p>

                        {/* WHY BUTTON */}
                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() =>
                            setOpenIndex(isOpen ? null : key)
                          }
                        >
                          {isOpen ? "Hide Details" : "Why this match?"}
                        </Button>

                        {/* ACCEPT BUTTON */}
                        <Button
                          size="sm"
                          className="mt-2 ml-2"
                          onClick={() =>
                            acceptMatch(r._id || r.child, m)
                          }
                        >
                          Accept Match
                        </Button>
                      </div>
                    </div>

                    {/* EXPANDABLE SECTION */}
                    {isOpen && (
                      <div className="mt-4 text-sm text-gray-600 border-t pt-3">
                        {m.explanation}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}