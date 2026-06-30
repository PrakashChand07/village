import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { useUserAuth } from '../context/UserAuthContext';
import { attemptsAPI } from '../api/testSeriesApi';
import { Trophy, Clock, Target, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, RotateCcw, Home, BarChart3 } from 'lucide-react';

interface QuestionReview {
  questionId: string;
  questionText: string;
  options: string[];
  selectedOption: number | null;
  correctAnswer: number;
  explanation: string;
  marks: number;
  negativeMarks: number;
  subject: string;
  isCorrect: boolean;
  isSkipped: boolean;
  marksObtained: number;
}

interface Attempt {
  _id: string;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  accuracy: number;
  timeTaken: number;
  completedAt: string;
  test: { _id: string; title: string };
  testSeries: { _id: string; title: string; category: string };
  subjectWisePerformance: { subject: string; correct: number; wrong: number; unanswered: number; accuracy: number }[];
  questionReview: QuestionReview[];
}

const FILTER_OPTIONS = ['All', 'Correct', 'Wrong', 'Skipped'];

export default function ResultPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { token } = useUserAuth();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewFilter, setReviewFilter] = useState('All');
  const [expandedQ, setExpandedQ] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!attemptId) return;
    attemptsAPI.getById(attemptId, token!).then(res => setAttempt(res.data.data)).catch(() => { }).finally(() => setLoading(false));
  }, [attemptId, token]);

  const toggleExpand = (id: string) => {
    setExpandedQ(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#6DBE45] border-t-transparent rounded-full animate-spin" /></div>;
  if (!attempt) return <div className="min-h-screen flex items-center justify-center text-gray-500">Result not found</div>;

  const filteredReview = (attempt.questionReview || []).filter(q => {
    if (reviewFilter === 'Correct') return q.isCorrect;
    if (reviewFilter === 'Wrong') return !q.isCorrect && !q.isSkipped;
    if (reviewFilter === 'Skipped') return q.isSkipped;
    return true;
  });

  const getMsg = (acc: number) => acc >= 90 ? '🏆 Outstanding!' : acc >= 75 ? '🎉 Excellent Work!' : acc >= 60 ? '👍 Good Job!' : acc >= 40 ? '📚 Keep Practicing!' : '💪 Don\'t Give Up!';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1a3c1a] via-[#2D7A1F] to-[#6DBE45] text-white py-12 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-4">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-1">Test Completed!</h1>
          <p className="text-xl text-white/90">{getMsg(attempt.accuracy)}</p>
          <p className="text-green-200 mt-1 text-sm">{attempt.test?.title}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 -mt-6">
        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-xl border p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Score', value: `${attempt.score}/${attempt.totalMarks}`, color: 'text-[#2D7A1F]' },
              { label: 'Accuracy', value: `${attempt.accuracy}%`, color: attempt.accuracy >= 75 ? 'text-green-600' : attempt.accuracy >= 50 ? 'text-yellow-600' : 'text-red-600' },
              { label: 'Correct', value: attempt.correctAnswers, color: 'text-green-600' },
              { label: 'Time Taken', value: `${Math.floor(attempt.timeTaken / 60)}m ${attempt.timeTaken % 60}s`, color: 'text-blue-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-4 bg-gray-50 rounded-xl">
                <div className={`text-3xl font-bold ${color}`}>{value}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Answer Distribution</span>
              <span>{attempt.correctAnswers}C / {attempt.wrongAnswers}W / {attempt.unanswered}S</span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
              <div className="bg-green-500 transition-all" style={{ width: `${(attempt.correctAnswers / (attempt.questionReview?.length || 1)) * 100}%` }} />
              <div className="bg-red-400 transition-all" style={{ width: `${(attempt.wrongAnswers / (attempt.questionReview?.length || 1)) * 100}%` }} />
              <div className="bg-gray-300 transition-all" style={{ width: `${(attempt.unanswered / (attempt.questionReview?.length || 1)) * 100}%` }} />
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full inline-block" />Correct</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded-full inline-block" />Wrong</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-300 rounded-full inline-block" />Skipped</span>
            </div>
          </div>
        </div>

        {/* Subject-wise */}
        {attempt.subjectWisePerformance?.length > 0 && (
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-[#6DBE45]" /> Subject-wise Performance</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {attempt.subjectWisePerformance.map(sub => (
                <div key={sub.subject} className="p-4 border rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">{sub.subject}</span>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${sub.accuracy >= 70 ? 'bg-green-100 text-green-700' : sub.accuracy >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{sub.accuracy}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className="h-2 bg-[#6DBE45] rounded-full" style={{ width: `${sub.accuracy}%` }} />
                  </div>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span className="text-green-600">{sub.correct} correct</span>
                    <span className="text-red-500">{sub.wrong} wrong</span>
                    <span>{sub.unanswered} skipped</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Answer Review (Testbook-style) */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <h2 className="font-bold text-gray-900 text-lg">Answer Review</h2>
            <div className="flex gap-2 flex-wrap">
              {FILTER_OPTIONS.map(f => (
                <button key={f} onClick={() => setReviewFilter(f)}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${reviewFilter === f ? 'bg-[#6DBE45] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredReview.map((q, idx) => (
              <div key={q.questionId} className={`border-2 rounded-xl overflow-hidden ${q.isCorrect ? 'border-green-200' : q.isSkipped ? 'border-gray-200' : 'border-red-200'}`}>
                <div className="flex items-start gap-3 p-4 cursor-pointer" onClick={() => toggleExpand(q.questionId)}>
                  <div className={`mt-0.5 flex-shrink-0 ${q.isCorrect ? 'text-green-500' : q.isSkipped ? 'text-gray-400' : 'text-red-500'}`}>
                    {q.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : q.isSkipped ? <AlertCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">Q{idx + 1}. {q.questionText}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{q.subject}</span>
                      <span className={`font-semibold ${q.marksObtained > 0 ? 'text-green-600' : q.marksObtained < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {q.marksObtained > 0 ? `+${q.marksObtained}` : q.marksObtained} marks
                      </span>
                    </div>
                  </div>
                  {expandedQ.has(q.questionId) ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </div>

                {expandedQ.has(q.questionId) && (
                  <div className="border-t px-4 pb-4 pt-3 space-y-3">
                    {q.options.map((opt, oi) => {
                      const isCorrect = oi === q.correctAnswer;
                      const isSelected = oi === q.selectedOption;
                      return (
                        <div key={oi} className={`flex items-start gap-3 p-3 rounded-xl border-2 text-sm ${isCorrect ? 'border-green-400 bg-green-50' : isSelected && !isCorrect ? 'border-red-400 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${isCorrect ? 'bg-green-500 text-white' : isSelected ? 'bg-red-400 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {String.fromCharCode(65 + oi)}
                          </div>
                          <div className="flex-1">{opt}</div>
                          {isCorrect && <span className="text-green-600 text-xs font-bold ml-auto flex-shrink-0">✓ Correct</span>}
                          {isSelected && !isCorrect && <span className="text-red-500 text-xs font-bold ml-auto flex-shrink-0">✗ Your Answer</span>}
                        </div>
                      );
                    })}
                    {q.explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <p className="text-xs font-semibold text-blue-700 mb-1">💡 Explanation</p>
                        <p className="text-sm text-blue-800">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center pb-8">
          <Link to="/test-series/dashboard" className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            <Home className="w-4 h-4" /> Dashboard
          </Link>
          <Link to={`/test-series/instructions/${attempt.test?._id}`}
            className="flex items-center gap-2 bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all">
            <RotateCcw className="w-4 h-4" /> Re-Attempt
          </Link>
          <Link to="/test-series/my-results" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            <BarChart3 className="w-4 h-4" /> All Results
          </Link>
        </div>
      </div>
    </div>
  );
}
