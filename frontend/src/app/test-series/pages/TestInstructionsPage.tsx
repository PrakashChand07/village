import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { testsAPI } from '../api/testSeriesApi';
import { Clock, Target, Award, XCircle, CheckCircle2, AlertCircle, BookOpen, ChevronLeft } from 'lucide-react';

interface Test {
  _id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  testSeries: { title: string; category: string; difficulty: string };
}

export default function TestInstructionsPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!testId) return;
    testsAPI.getById(testId).then(res => setTest(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [testId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#6DBE45] border-t-transparent rounded-full animate-spin" /></div>;
  if (!test) return <div className="min-h-screen flex items-center justify-center text-gray-500">Test not found</div>;

  const negativeMarks = 0.25;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#1a3c1a] to-[#2D7A1F] text-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-green-200 hover:text-white text-sm mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full">{test.testSeries?.category}</span>
          <h1 className="text-2xl font-bold mt-2">{test.title}</h1>
          {test.description && <p className="text-green-200 mt-1">{test.description}</p>}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Target, label: 'Questions', value: test.totalQuestions },
            { icon: Clock, label: 'Duration', value: `${test.duration} min` },
            { icon: Award, label: 'Total Marks', value: test.totalMarks || test.totalQuestions },
            { icon: XCircle, label: 'Negative', value: `-${negativeMarks}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm">
              <div className="p-2 bg-[#6DBE45]/10 rounded-lg"><Icon className="w-5 h-5 text-[#6DBE45]" /></div>
              <div><p className="text-xs text-gray-500">{label}</p><p className="font-bold text-gray-900">{value}</p></div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#6DBE45]" /> Important Instructions
          </h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">General Instructions</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  `This test has ${test.totalQuestions} questions. Duration: ${test.duration} minutes.`,
                  `Each correct answer gives +1 mark. Wrong answer deducts ${negativeMarks} marks.`,
                  'The test auto-submits when the timer ends.',
                  'You can mark questions for review and revisit them before submitting.',
                  'Ensure a stable internet connection throughout the test.',
                  'After submission, you can instantly see your score and review all answers with explanations.',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#6DBE45] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Question Palette Legend</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {[
                  { bg: 'bg-gray-200', border: 'border-gray-400', label: 'Not Visited' },
                  { bg: 'bg-red-100', border: 'border-red-400', label: 'Not Answered' },
                  { bg: 'bg-[#6DBE45]', border: 'border-[#2D7A1F]', label: 'Answered', text: 'text-white' },
                  { bg: 'bg-purple-200', border: 'border-purple-400', label: 'Marked for Review' },
                ].map(({ bg, border, label, text }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded ${bg} border-2 ${border} ${text || ''} flex items-center justify-center text-xs font-bold`}>1</div>
                    <span className="text-gray-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Agree & Start */}
        <div className="bg-white rounded-2xl border-2 border-[#6DBE45]/30 shadow-sm p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 accent-[#6DBE45]" />
            <span className="text-gray-700">I have read and understood all instructions. I am ready to begin the test.</span>
          </label>
          <div className="flex gap-3 mt-5">
            <button onClick={() => navigate(-1)}
              className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={() => navigate(`/test-series/live/${testId}`, { replace: true })}
              disabled={!agreed}
              className="flex-1 bg-gradient-to-r from-[#6DBE45] to-[#2D7A1F] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BookOpen className="w-5 h-5" /> Start Test Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
