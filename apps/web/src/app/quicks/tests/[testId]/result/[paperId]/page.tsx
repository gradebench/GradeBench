"use client";

import { Badge } from "@gb/ui/src/components/ui/badge";
import { Button } from "@gb/ui/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gb/ui/src/components/ui/card";
import {
  ArrowLeft,
  Bot,
  ChevronDown,
  ChevronRight,
  Download,
  Edit2,
  Loader2,
  Maximize2,
  MessageSquare,
  Minimize2,
  PieChart,
  RefreshCw,
  Send,
  Share2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type AnswerPaper,
  getAnswerPapersByAcademicTest,
} from "@/lib/answer-papers-api";
import "@gb/ui/src/styles/globals.css";

// --- UTILITY FUNCTIONS ---
const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(" ");

// --- VISUALIZATION COMPONENTS ---
const RadarChart = ({ data }: { data: { topic: string; score: number }[] }) => {
  const size = 200;
  const center = size / 2;
  const radius = (size - 40) / 2;
  const angleSlice = (Math.PI * 2) / data.length;

  const getPoint = (score: number, index: number) => {
    const angle = index * angleSlice - Math.PI / 2;
    const r = (score / 100) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  };

  const points = data.map((d, i) => getPoint(d.score, i)).join(" ");

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="overflow-visible">
        <title>Topic Performance Radar Chart</title>
        {/* Grid Background */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
          <polygon
            key={i}
            points={data.map((_, idx) => getPoint(100 * scale, idx)).join(" ")}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
          />
        ))}
        {/* Axis Lines */}
        {data.map((_, i) => {
          const [x, y] = getPoint(100, i).split(",");
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
          );
        })}
        {/* Data Shape */}
        <polygon
          points={points}
          fill="hsl(var(--primary) / 0.2)"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />
        {/* Data Points */}
        {data.map((d, i) => {
          const [x, y] = getPoint(d.score, i).split(",");
          return (
            <circle key={i} cx={x} cy={y} r="3" fill="hsl(var(--primary))" />
          );
        })}
        {/* Labels */}
        {data.map((d, i) => {
          const [x, y] = getPoint(115, i).split(",");
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
              fontWeight="bold"
              dy="4"
            >
              {d.topic}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const BellCurveChart = ({
  studentScore,
  avgScore,
  topperScore,
  maxScore,
}: {
  studentScore: number;
  avgScore: number;
  topperScore: number;
  maxScore: number;
}) => {
  const width = 300;
  const height = 80;

  const path = `M 0,${height} C 50,${height} 100,0 150,0 S 250,${height} 300,${height}`;

  const getX = (score: number) => {
    return (score / maxScore) * width;
  };

  return (
    <div className="relative flex h-28 w-full items-end justify-center">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height + 20}`}
        preserveAspectRatio="none"
      >
        <title>Score Distribution Bell Curve</title>
        <path
          d={path}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Student Marker */}
        <line
          x1={getX(studentScore)}
          y1="0"
          x2={getX(studentScore)}
          y2={height}
          stroke="hsl(var(--destructive))"
          strokeWidth="2"
        />
        <circle
          cx={getX(studentScore)}
          cy={height}
          r="4"
          fill="hsl(var(--destructive))"
        />

        {/* Avg Marker */}
        <line
          x1={getX(avgScore)}
          y1="20"
          x2={getX(avgScore)}
          y2={height}
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="2"
          strokeDasharray="2 2"
        />

        {/* Topper Marker */}
        <line
          x1={getX(topperScore)}
          y1="10"
          x2={getX(topperScore)}
          y2={height}
          stroke="#10b981"
          strokeWidth="2"
        />
      </svg>

      <div className="absolute bottom-0 flex w-full justify-between px-2 font-medium text-[10px] text-muted-foreground">
        <span>0</span>
        <span>Marks Distribution</span>
        <span>{maxScore}</span>
      </div>

      <div
        className="-translate-x-1/2 absolute top-2 transform rounded border border-destructive/20 bg-destructive/10 px-2 py-1 font-bold text-[10px] text-destructive shadow-sm"
        style={{ left: `${(studentScore / maxScore) * 100}%` }}
      >
        You ({studentScore})
      </div>
      <div
        className="-translate-x-1/2 absolute top-10 transform rounded border border-border bg-muted px-2 py-1 font-bold text-[10px] text-muted-foreground shadow-sm"
        style={{ left: `${(avgScore / maxScore) * 100}%` }}
      >
        Avg ({avgScore})
      </div>
      <div
        className="-translate-x-1/2 absolute top-0 transform rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 font-bold text-[10px] text-emerald-400 shadow-sm"
        style={{ left: `${(topperScore / maxScore) * 100}%` }}
      >
        Topper ({topperScore})
      </div>
    </div>
  );
};

// --- TYPE DEFINITIONS ---
interface Annotation {
  text_content: string;
  page_number: number;
  color: string;
  annotation_type: string;
  correctness_indicator: string;
  annotation_id: string;
  coordinates: { x: number; y: number }[];
}

interface QuestionEvaluation {
  percentage: number;
  marks_total: number;
  question_number: string;
  feedback: {
    strengths: string[];
    summary: string;
    weaknesses: string[];
    tone?: string;
    suggestions?: string[];
  };
  marks_awarded: number;
  annotations?: Annotation[];
}

interface EvaluationData {
  evaluation_id: string;
  question_evaluations: QuestionEvaluation[];
  overall_feedback: {
    summary: string;
    key_strengths: string[];
    areas_for_improvement: string[];
  };
  overall_score: {
    percentage: number;
    total_marks_awarded: number;
    grade: string;
    total_marks_possible: number;
  };
}

// --- AI COMPONENTS ---
const AiRewriteWidget = () => {
  const [rewritten, setRewritten] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRewrite = async () => {
    setLoading(true);
    // Simulated AI response
    setTimeout(() => {
      setRewritten(
        "Consider structuring your answer with a clear introduction, body paragraphs with relevant examples, and a concise conclusion. Start by defining key terms and then elaborate on the specific constitutional provisions."
      );
      setLoading(false);
    }, 2000);
  };

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 to-card shadow-sm">
      <div className="flex flex-row items-center justify-between border-primary/10 border-b p-4">
        <div className="flex items-center gap-2 font-bold text-primary text-xs uppercase tracking-wide">
          <Sparkles size={14} className="text-primary" /> AI Mentor Fix
        </div>
        {!rewritten && (
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-[10px]"
            onClick={handleRewrite}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={10} className="mr-1.5 animate-spin" />
            ) : (
              <RefreshCw size={10} className="mr-1.5" />
            )}
            {loading ? "Thinking..." : "Improve Answer"}
          </Button>
        )}
      </div>
      {rewritten && (
        <div className="fade-in slide-in-from-top-2 animate-in bg-card p-4 duration-300">
          <span className="mb-2 block font-bold text-[10px] text-primary uppercase tracking-wider">
            Suggested Improvement
          </span>
          <p className="border-primary border-l-2 pl-3 text-muted-foreground text-sm italic leading-relaxed">
            "{rewritten}"
          </p>
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="ghost" size="sm" className="h-6 px-0 text-[10px]">
              <Share2 size={10} className="mr-1" /> Copy
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

const AiChatFloating = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "ai" | "user"; text: string }[]
  >([
    {
      role: "ai",
      text: "Hello! I can help you analyze your result. Ask me anything.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages((p) => [...p, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);
    // Simulated AI response
    setTimeout(() => {
      setMessages((p) => [
        ...p,
        {
          role: "ai",
          text: "I understand your concern. Let me help you with that topic. Consider reviewing the relevant constitutional articles and Supreme Court judgments.",
        },
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="fade-in slide-in-from-bottom-10 mb-4 w-80 origin-bottom-right animate-in overflow-hidden rounded-xl border border-border bg-card shadow-2xl duration-300">
          <div className="flex items-center justify-between bg-primary p-3 text-primary-foreground">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Bot size={16} /> AI Mentor
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="hover:opacity-80"
            >
              <Minimize2 size={16} />
            </button>
          </div>
          <div className="h-72 space-y-3 overflow-y-auto bg-muted/30 p-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "rounded-br-none bg-primary text-primary-foreground"
                      : "rounded-bl-none border border-border bg-card text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-none border border-border bg-card px-3 py-2 text-muted-foreground text-xs">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2 border-border border-t bg-card p-2">
            <input
              className="flex-1 rounded-full border-0 bg-muted px-3 py-2 text-foreground text-xs outline-none transition-all focus:ring-1 focus:ring-primary"
              placeholder="Ask a doubt..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              type="button"
              onClick={handleSend}
              className="rounded-full bg-primary p-2 text-primary-foreground transition-colors hover:opacity-90"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
      <Button
        className="h-12 w-12 rounded-full bg-primary shadow-xl transition-all duration-300 hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDown className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const QuestionGrid = ({
  questions,
  onSelectQuestion,
  selectedQuestionId,
}: {
  questions: QuestionEvaluation[];
  onSelectQuestion: (id: string) => void;
  selectedQuestionId: string;
}) => {
  return (
    <div className="mb-6">
      <h3 className="mb-3 font-bold text-muted-foreground text-xs uppercase tracking-wide">
        Question Map
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, i) => {
          const colorClass =
            q.percentage >= 60
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              : q.percentage >= 40
              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
              : "bg-rose-500/10 text-rose-400 border-rose-500/30";

          const isSelected = selectedQuestionId === `q${q.question_number}`;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectQuestion(`q${q.question_number}`)}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-lg border p-2 transition-all duration-200",
                colorClass,
                isSelected
                  ? "z-10 shadow-md ring-2 ring-primary ring-offset-1 ring-offset-background"
                  : "opacity-80 hover:scale-105 hover:opacity-100"
              )}
            >
              <span className="font-bold text-[10px]">
                Q{q.question_number}
              </span>
              <span className="font-black text-xs">{q.marks_awarded}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const AnswerScript = ({
  pdfUrl,
  isFocused,
  toggleFocus,
}: {
  pdfUrl: string;
  isFocused: boolean;
  toggleFocus: () => void;
}) => {
  const [zoom, setZoom] = useState(100);

  return (
    <div
      className={cn(
        "relative flex flex-col bg-muted/30 transition-all duration-300",
        isFocused ? "h-full w-full" : "h-full w-full"
      )}
    >
      {/* Toolbar */}
      <div className="z-20 flex h-12 shrink-0 items-center justify-between border-border border-b bg-card px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </Button>
          <span className="w-10 text-center font-mono text-muted-foreground text-xs">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom((z) => Math.min(150, z + 10))}
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="mx-1 h-4 w-px bg-border" />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFocus}
            title={isFocused ? "Exit Focus" : "Focus Mode"}
          >
            {isFocused ? (
              <Minimize2 size={16} className="text-primary" />
            ) : (
              <Maximize2 size={16} />
            )}
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="custom-scrollbar flex flex-1 justify-center overflow-y-auto bg-muted/30 p-4">
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="Annotated Answer Script"
            className="h-full w-full rounded-sm border border-border bg-card shadow-xl"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Loading PDF...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Tab components
const TabTrigger = ({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      active
        ? "bg-card text-foreground shadow-sm"
        : "hover:bg-muted/50 hover:text-foreground"
    )}
  >
    {children}
  </button>
);

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params?.testId as string;
  const paperId = params?.paperId as string;

  const [paper, setPaper] = useState<AnswerPaper | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [questions, setQuestions] = useState<QuestionEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state for enhanced UI
  const [selectedQuestionId, setSelectedQuestionId] = useState("q1");
  const [activeTab, setActiveTab] = useState<"overview" | "analysis">(
    "overview"
  );
  const [focusMode, setFocusMode] = useState(false);

  // Topic breakdown for radar chart (derived from questions)
  const topicBreakdown = questions.reduce((acc, q) => {
    const topic = `Q${q.question_number}`; // Use question number as topic for demo
    acc.push({ topic, score: q.percentage });
    return acc;
  }, [] as { topic: string; score: number }[]);

  useEffect(() => {
    const loadData = async () => {
      if (!testId || !paperId) {
        setError("Missing test ID or paper ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const papers = await getAnswerPapersByAcademicTest(testId);
        const foundPaper = papers.find((p) => p.id === paperId);

        if (!foundPaper) {
          setError("Paper not found.");
          return;
        }

        setPaper(foundPaper);

        if (foundPaper.processed_document_url) {
          const res = await fetch(foundPaper.processed_document_url);
          if (!res.ok) throw new Error("Failed to fetch evaluation data");
          const data: EvaluationData = await res.json();

          setEvaluation(data);
          setQuestions(data.question_evaluations || []);
        } else {
          setError("Evaluation data not available yet");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load result data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [testId, paperId]);

  const handleQuestionSelect = (id: string) => {
    setSelectedQuestionId(id);
    if (activeTab === "overview") setActiveTab("analysis");

    // Scroll to question
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element)
        element.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !paper || !evaluation) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error || "Failed to load data"}</p>
        <Button onClick={() => router.push(`/quicks/tests/${testId}/evaluate`)}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="dark custom-scrollbar flex h-screen flex-col overflow-hidden bg-background font-sans text-foreground selection:bg-primary/20">
      <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--muted)); border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: hsl(var(--muted-foreground)); }
                
                @media print {
                  body * { visibility: hidden; }
                  #print-area, #print-area * { visibility: visible; }
                  #print-area { position: absolute; left: 0; top: 0; width: 100%; }
                  .no-print { display: none !important; }
                }
            `}</style>

      {/* Header */}
      {!focusMode && (
        <header className="no-print z-30 flex h-16 flex-shrink-0 items-center justify-between border-border border-b bg-card px-6 shadow-sm">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 gap-2"
              onClick={() => router.push(`/quicks/tests/${testId}/evaluate`)}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <div>
              <h1 className="font-bold text-foreground text-lg leading-tight">
                Evaluation Result
              </h1>
              <div className="mt-0.5 flex items-center gap-3">
                <span className="font-medium text-muted-foreground text-xs">
                  {paper.student_name}
                </span>
                <span className="text-muted">•</span>
                <span className="font-medium text-muted-foreground text-xs">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => window.print()}
            >
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        </header>
      )}

      <main className="relative flex flex-1 overflow-hidden" id="print-area">
        {/* LEFT: Answer Script Viewer */}
        <div
          className={cn(
            "relative hidden border-border border-r bg-muted/30 lg:flex lg:flex-col",
            focusMode ? "w-full" : "w-1/2"
          )}
        >
          {focusMode && (
            <div className="absolute top-4 left-4 z-50">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setFocusMode(false)}
                className="border border-slate-200 shadow-lg"
              >
                <Minimize2 className="mr-2 h-3 w-3" /> Exit Focus
              </Button>
            </div>
          )}
          <AnswerScript
            pdfUrl={paper.annotated_document_url || ""}
            isFocused={focusMode}
            toggleFocus={() => setFocusMode(!focusMode)}
          />
        </div>

        {/* RIGHT: Dashboard (Hidden in Focus Mode) */}
        {!focusMode && (
          <div className="flex w-full flex-col overflow-hidden border-border border-l bg-card lg:w-1/2">
            {/* Tabs Header */}
            <div className="z-10 border-border border-b bg-card/80 px-6 py-3 backdrop-blur-sm">
              <div className="grid w-full grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                <TabTrigger
                  active={activeTab === "overview"}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview & Analytics
                </TabTrigger>
                <TabTrigger
                  active={activeTab === "analysis"}
                  onClick={() => setActiveTab("analysis")}
                >
                  Detailed Analysis
                </TabTrigger>
              </div>
            </div>

            <div className="custom-scrollbar flex-1 overflow-y-auto scroll-smooth p-6 pb-24">
              {/* TAB: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="fade-in slide-in-from-right-4 animate-in space-y-6 duration-300">
                  {/* Score Cards */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="border-border bg-muted">
                      <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                        <span className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                          Total Score
                        </span>
                        <div className="flex items-baseline gap-1 font-black text-3xl text-foreground">
                          {evaluation.overall_score.total_marks_awarded}{" "}
                          <span className="font-medium text-muted-foreground text-sm">
                            / {evaluation.overall_score.total_marks_possible}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-border bg-muted">
                      <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                        <span className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                          Grade
                        </span>
                        <div className="flex items-baseline gap-2 font-black text-3xl text-destructive">
                          {evaluation.overall_score.grade}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-border bg-muted">
                      <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                        <span className="mb-1 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
                          Percentage
                        </span>
                        <div className="flex items-baseline gap-2 font-black text-3xl text-foreground">
                          {evaluation.overall_score.percentage.toFixed(1)}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Visualization Row */}
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {/* Radar Chart */}
                    {topicBreakdown.length > 0 && (
                      <Card>
                        <CardHeader className="bg-muted/50 px-5 py-3">
                          <CardTitle className="flex items-center gap-2 font-bold text-muted-foreground text-xs uppercase">
                            <PieChart size={14} /> Question Performance
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center py-4">
                          <RadarChart data={topicBreakdown.slice(0, 6)} />
                        </CardContent>
                      </Card>
                    )}

                    {/* Bell Curve */}
                    <Card>
                      <CardHeader className="bg-muted/50 px-5 py-3">
                        <CardTitle className="flex items-center gap-2 font-bold text-muted-foreground text-xs uppercase">
                          <TrendingUp size={14} /> Cohort Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center justify-center px-4 py-8">
                        <BellCurveChart
                          studentScore={
                            evaluation.overall_score.total_marks_awarded
                          }
                          avgScore={Math.round(
                            evaluation.overall_score.total_marks_possible * 0.6
                          )}
                          topperScore={Math.round(
                            evaluation.overall_score.total_marks_possible * 0.85
                          )}
                          maxScore={
                            evaluation.overall_score.total_marks_possible
                          }
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Overall Feedback */}
                  <Card className="border-l-4 border-l-primary bg-gradient-to-br from-muted/50 to-card shadow-sm">
                    <CardContent className="p-5">
                      <h4 className="mb-3 flex items-center gap-2 font-bold text-foreground text-sm">
                        <Zap size={16} className="text-amber-500" /> Mentor's
                        Summary
                      </h4>
                      <p className="mb-4 font-medium text-muted-foreground text-sm leading-relaxed">
                        {evaluation.overall_feedback.summary}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {evaluation.overall_feedback.areas_for_improvement
                          .slice(0, 3)
                          .map((area, i) => (
                            <Badge key={i} variant="secondary" className="py-1">
                              {area.substring(0, 40)}
                            </Badge>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB: ANALYSIS */}
              {activeTab === "analysis" && (
                <div className="fade-in slide-in-from-right-4 animate-in space-y-6 duration-300">
                  <QuestionGrid
                    questions={questions}
                    onSelectQuestion={handleQuestionSelect}
                    selectedQuestionId={selectedQuestionId}
                  />

                  <div className="space-y-4">
                    {questions.map((q, index) => {
                      const isSelected =
                        `q${q.question_number}` === selectedQuestionId;
                      return (
                        <div
                          key={index}
                          id={`q${q.question_number}`}
                          className="scroll-mt-4"
                        >
                          <Card
                            onClick={() =>
                              handleQuestionSelect(`q${q.question_number}`)
                            }
                            className={cn(
                              "group cursor-pointer overflow-hidden border-l-4 transition-all duration-300 hover:shadow-lg",
                              isSelected
                                ? "scale-[1.01] transform border-l-indigo-600 shadow-md ring-1 ring-indigo-200"
                                : "border-l-transparent hover:border-l-slate-300"
                            )}
                          >
                            <div
                              className={cn(
                                "flex flex-row items-center justify-between px-5 py-4 transition-colors",
                                isSelected ? "bg-indigo-50/30" : "bg-white"
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center">
                                  <Badge
                                    variant="outline"
                                    className="h-6 min-w-[2.5rem] justify-center border-slate-200 bg-white font-bold text-slate-700 shadow-sm"
                                  >
                                    Q{q.question_number}
                                  </Badge>
                                  {isSelected && (
                                    <div className="mt-1 h-8 w-px bg-indigo-200" />
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                                    Question {q.question_number}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <span
                                    className={cn(
                                      "block font-bold text-sm",
                                      q.percentage >= 50
                                        ? "text-emerald-600"
                                        : "text-rose-600"
                                    )}
                                  >
                                    {q.marks_awarded}{" "}
                                    <span className="font-normal text-slate-400 text-xs">
                                      / {q.marks_total}
                                    </span>
                                  </span>
                                </div>
                                {isSelected ? (
                                  <ChevronDown className="h-4 w-4 text-indigo-500" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                                )}
                              </div>
                            </div>

                            <div
                              className={cn(
                                "overflow-hidden bg-white transition-all duration-500 ease-in-out",
                                isSelected
                                  ? "max-h-[800px] opacity-100"
                                  : "max-h-0 opacity-0"
                              )}
                            >
                              <div className="space-y-5 px-5 pt-0 pb-5">
                                <div className="relative rounded-lg border border-slate-100 bg-slate-50 p-4 text-slate-700 text-sm leading-relaxed">
                                  <span className="relative z-10">
                                    {q.feedback.summary}
                                  </span>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                  {q.feedback.strengths &&
                                    q.feedback.strengths.length > 0 && (
                                      <div className="rounded-lg border border-emerald-100/50 bg-emerald-50/50 p-3">
                                        <p className="mb-2 flex items-center gap-1.5 font-bold text-[10px] text-emerald-700 uppercase">
                                          <ThumbsUp size={12} /> Strengths
                                        </p>
                                        <ul className="space-y-1">
                                          {q.feedback.strengths.map((s, i) => (
                                            <li
                                              key={i}
                                              className="flex gap-2 text-slate-600 text-xs"
                                            >
                                              <span className="text-emerald-500">
                                                •
                                              </span>
                                              {s}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  {q.feedback.weaknesses &&
                                    q.feedback.weaknesses.length > 0 && (
                                      <div className="rounded-lg border border-rose-100/50 bg-rose-50/50 p-3">
                                        <p className="mb-2 flex items-center gap-1.5 font-bold text-[10px] text-rose-700 uppercase">
                                          <ThumbsDown size={12} /> Weaknesses
                                        </p>
                                        <ul className="space-y-1">
                                          {q.feedback.weaknesses.map((w, i) => (
                                            <li
                                              key={i}
                                              className="flex gap-2 text-slate-600 text-xs"
                                            >
                                              <span className="text-rose-500">
                                                •
                                              </span>
                                              {w}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                </div>

                                {q.percentage < 40 && <AiRewriteWidget />}

                                {q.feedback.suggestions &&
                                  q.feedback.suggestions.length > 0 && (
                                    <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-3 shadow-sm transition-all hover:shadow-md">
                                      <p className="mb-2 flex items-center gap-1.5 font-medium text-amber-700 text-xs">
                                        <Edit2 className="h-3 w-3" />{" "}
                                        Suggestions
                                      </p>
                                      <ul className="space-y-1">
                                        {q.feedback.suggestions.map((s, i) => (
                                          <li
                                            key={i}
                                            className="text-[11px] text-muted-foreground"
                                          >
                                            • {s}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <div className="no-print">
        <AiChatFloating />
      </div>
    </div>
  );
}
