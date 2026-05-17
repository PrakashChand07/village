import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useUserAuth } from '../context/UserAuthContext';
import { questionsAPI, attemptsAPI, testsAPI } from '../api/testSeriesApi';
import { Clock, Flag, ChevronLeft, ChevronRight, Save, X, Send, AlertTriangle, Maximize } from 'lucide-react';

interface Question {
  _id: string;
  questionNumber: number;
  questionText: string;
  options: string[];
  marks: number;
  negativeMarks: number;
  subject: string;
}

interface Answer { questionId: string; selectedOption: number | null; }
type Status = 'not-visited' | 'not-answered' | 'answered' | 'marked' | 'answered-marked';

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function LiveTestPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { token } = useUserAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [test, setTest] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [marked, setMarked] = useState<boolean[]>([]);
  const [visited, setVisited] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  
  // Anti-cheat states
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [needsFullscreenInteraction, setNeedsFullscreenInteraction] = useState(false);
  
  const startTime = useRef(Date.now());
  const maxViolations = 3;

  useEffect(() => {
    if (!testId) return;
    Promise.all([
      questionsAPI.getForTest(testId, token!),
      testsAPI.getById(testId),
    ]).then(([qRes, tRes]) => {
      const qs = qRes.data.data;
      setQuestions(qs);
      setTest(tRes.data.data);
      setAnswers(qs.map((q: Question) => ({ questionId: q._id, selectedOption: null })));
      setMarked(new Array(qs.length).fill(false));
      const v = new Array(qs.length).fill(false);
      v[0] = true;
      setVisited(v);
      setTimeLeft((tRes.data.data.duration || 60) * 60);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [testId, token]);

  useEffect(() => {
    if (timeLeft <= 0 || loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading]);

  // Anti-cheat logic
  const handleViolation = useCallback((message: string) => {
    setViolations(prev => {
      const newCount = prev + 1;
      if (newCount >= maxViolations) {
        setWarningMessage('Maximum violations reached. Auto-submitting test...');
        setShowWarning(true);
        setTimeout(() => handleSubmit(), 2000);
      } else {
        setWarningMessage(`${message} (Warning ${newCount} of ${maxViolations})`);
        setShowWarning(true);
      }
      return newCount;
    });
  }, []);

  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setNeedsFullscreenInteraction(false);
    } catch (err) {
      setNeedsFullscreenInteraction(true);
    }
  };

  useEffect(() => {
    if (loading) return;

    // 1. Enforce Fullscreen
    enterFullscreen();

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !submitting) {
        handleViolation('You exited full-screen mode! Please stay in full-screen during the test.');
      }
    };

    // 2. Detect Tab Switching
    const handleVisibilityChange = () => {
      if (document.hidden && !submitting) {
        handleViolation('You switched tabs or minimized the browser! This is not allowed.');
      }
    };

    // 3. Prevent Back Button
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
      handleViolation('Navigating back is disabled during an active test.');
    };

    // Attach listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);

    // Prevent default shortcuts (Ctrl+C, Ctrl+V, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'p', 's'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [loading, handleViolation, submitting]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    setVisited(prev => { const v = [...prev]; v[idx] = true; return v; });
  };

  const selectOption = (optIdx: number) => {
    setAnswers(prev => { const a = [...prev]; a[current] = { ...a[current], selectedOption: optIdx }; return a; });
  };

  const clearAnswer = () => {
    setAnswers(prev => { const a = [...prev]; a[current] = { ...a[current], selectedOption: null }; return a; });
  };

  const toggleMark = () => {
    setMarked(prev => { const m = [...prev]; m[current] = !m[current]; return m; });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const timeTaken = Math.floor((Date.now() - startTime.current) / 1000);
      const res = await attemptsAPI.submit({ testId: testId!, answers, timeTaken }, token!);
      navigate(`/test-series/result/${res.data.attemptId}`, { replace: true });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Submission failed. Please try again.');
      setSubmitting(false);
    }
  };

  const getStatus = (idx: number): Status => {
    const ans = answers[idx];
    if (!visited[idx]) return 'not-visited';
    if (ans.selectedOption !== null && marked[idx]) return 'answered-marked';
    if (ans.selectedOption !== null) return 'answered';
    if (marked[idx]) return 'marked';
    return 'not-answered';
  };

  const statusClass = (s: Status, isCurrent: boolean) => {
    const base = 'w-9 h-9 rounded-lg border-2 text-sm font-bold flex items-center justify-center cursor-pointer transition-all ';
    const ring = isCurrent ? 'ring-2 ring-offset-1 ring-gray-400 ' : '';
    switch (s) {
      case 'answered': return base + ring + 'bg-[#6DBE45] border-[#2D7A1F] text-white';
      case 'marked': return base + ring + 'bg-purple-200 border-purple-500 text-purple-800';
      case 'answered-marked': return base + ring + 'bg-[#6DBE45]/70 border-purple-500 text-white';
      case 'not-answered': return base + ring + 'bg-red-100 border-red-400 text-red-700';
      default: return base + ring + 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const answered = answers.filter(a => a.selectedOption !== null).length;
  const notAnswered = answers.length - answered;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#6DBE45] border-t-transparent rounded-full animate-spin" /></div>;
  if (!questions.length) return <div className="min-h-screen flex items-center justify-center text-gray-500">No questions found for this test.</div>;

  const q = questions[current];
  const currentAnswer = answers[current];

  return (
    <div 
      className="min-h-screen bg-gray-100 flex flex-col select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
    >
      {/* Interaction Overlay if Fullscreen fails on mount */}
      {needsFullscreenInteraction && !loading && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-6 text-center">
          <Maximize className="w-16 h-16 text-[#6DBE45] mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Start?</h2>
          <p className="text-gray-600 mb-6 max-w-md">This test requires full-screen mode to ensure a secure exam environment. Click the button below to enter full-screen and begin the test.</p>
          <button 
            onClick={enterFullscreen}
            className="bg-[#6DBE45] text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-[#2D7A1F] shadow-lg transition-all"
          >
            Enter Full Screen
          </button>
        </div>
      )}

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-red-900/90 backdrop-blur-sm flex items-center justify-center z-[90] p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-red-500 animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Warning!</h2>
            <p className="text-gray-700 text-lg mb-6 font-medium">{warningMessage}</p>
            {violations < maxViolations && (
              <button 
                onClick={() => { setShowWarning(false); enterFullscreen(); }}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors"
              >
                I Understand, Return to Test
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="bg-gradient-to-r from-[#1a3c1a] to-[#2D7A1F] text-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{test?.testSeries?.category}</span>
            <h2 className="font-semibold hidden md:block text-sm truncate max-w-xs">{test?.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold text-sm ${timeLeft < 300 ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`}>
              <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
            </div>
            <button onClick={() => setShowDialog(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors">
              <Send className="w-4 h-4" /> Submit
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full gap-4 p-4">
        {/* Question Panel */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-4">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-[#6DBE45]/10 text-[#2D7A1F] text-xs px-3 py-1 rounded-full font-bold">Q.{q.questionNumber}</span>
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{q.subject}</span>
              <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">+{q.marks}</span>
              <span className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full">-{q.negativeMarks}</span>
            </div>
            <p className="text-gray-900 text-base leading-relaxed mb-6">{q.questionText}</p>
            <div className="space-y-3">
              {q.options.map((opt, idx) => (
                <button key={idx} onClick={() => selectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-sm flex items-start gap-3 ${currentAnswer.selectedOption === idx ? 'border-[#6DBE45] bg-[#6DBE45]/10' : 'border-gray-200 hover:border-[#6DBE45]/50'}`}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-sm ${currentAnswer.selectedOption === idx ? 'border-[#6DBE45] bg-[#6DBE45] text-white' : 'border-gray-300'}`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-gray-800">{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nav Buttons */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => goTo(Math.max(0, current - 1))} disabled={current === 0}
              className="flex items-center gap-1 px-4 py-2 border rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button onClick={toggleMark}
              className={`flex items-center gap-1 px-4 py-2 border rounded-xl text-sm font-medium transition-colors ${marked[current] ? 'bg-purple-100 border-purple-300 text-purple-700' : 'hover:bg-gray-50'}`}>
              <Flag className="w-4 h-4" /> {marked[current] ? 'Unmark' : 'Mark Review'}
            </button>
            <button onClick={clearAnswer}
              className="flex items-center gap-1 px-4 py-2 border rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              <X className="w-4 h-4" /> Clear
            </button>
            <button onClick={() => { if (current < questions.length - 1) goTo(current + 1); }}
              disabled={current === questions.length - 1}
              className="flex items-center gap-1 px-4 py-2 bg-[#6DBE45] text-white rounded-xl text-sm font-semibold hover:bg-[#2D7A1F] disabled:opacity-40 transition-colors ml-auto">
              <Save className="w-4 h-4" /> Save & Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Palette */}
        <div className="w-full lg:w-72 bg-white rounded-2xl border shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4">Question Palette</h3>
          <div className="grid grid-cols-4 gap-2 text-xs mb-4">
            {[
              { color: 'bg-[#6DBE45]', label: `Answered (${answered})` },
              { color: 'bg-red-100 border border-red-400', label: `Not Ans (${notAnswered})` },
              { color: 'bg-purple-200', label: 'Marked' },
              { color: 'bg-gray-100', label: 'Not Visited' },
            ].map(({ color, label }) => (
              <div key={label} className="col-span-2 flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${color}`} />
                <span className="text-gray-600">{label}</span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-gray-100 rounded-full mb-4">
            <div className="h-1 bg-[#6DBE45] rounded-full transition-all" style={{ width: `${(answered / questions.length) * 100}%` }} />
          </div>
          <div className="grid grid-cols-5 gap-1.5 max-h-80 overflow-y-auto">
            {questions.map((_, idx) => (
              <button key={idx} onClick={() => goTo(idx)}
                className={statusClass(getStatus(idx), idx === current)}>
                {idx + 1}
              </button>
            ))}
          </div>
          <button onClick={() => setShowDialog(true)}
            className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors">
            Submit Test
          </button>
        </div>
      </div>

      {/* Submit Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Submit Test?</h3>
            <p className="text-sm text-gray-500 mb-4">You won't be able to change your answers after submission.</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{answered}</div>
                <div className="text-xs text-gray-500">Answered</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-xl">
                <div className="text-2xl font-bold text-red-500">{notAnswered}</div>
                <div className="text-xs text-gray-500">Not Answered</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDialog(false)} className="flex-1 border border-gray-300 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-semibold hover:bg-red-600 disabled:opacity-70">
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
