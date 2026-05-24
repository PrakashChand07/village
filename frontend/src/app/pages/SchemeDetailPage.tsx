import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchSchemeById } from "../../services/api";
import {
  ArrowLeft, Leaf, BadgeCheck, ExternalLink,
  Loader2, AlertCircle, Tag, Banknote, Users, Info
} from "lucide-react";

const formatUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

export function SchemeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetchSchemeById(id);
        if (response.success) {
          setScheme(response.data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
          <p className="text-gray-500 text-lg font-medium">Loading scheme details...</p>
        </div>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700">Scheme Not Found</h3>
          <p className="text-gray-500">This scheme may have been removed.</p>
          <button
            onClick={() => navigate("/village-schemes")}
            className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Schemes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Back Button */}
        <button
          onClick={() => navigate("/village-schemes")}
          className="flex items-center gap-2 text-green-700 font-semibold hover:text-green-900 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Village Schemes
        </button>

        {/* Header Card */}
        <div className="bg-gradient-to-br from-green-600 to-teal-700 text-white rounded-3xl p-8 mb-8 shadow-xl shadow-green-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {scheme.category}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{scheme.title}</h1>
            </div>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Banknote className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Benefit</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">{scheme.benefit}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Eligibility</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">{scheme.eligibility}</p>
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-green-600" />
              <h2 className="text-sm font-bold text-green-700 uppercase tracking-wider">About This Scheme</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">{scheme.description}</p>
          </div>

          {/* Rich Content Blocks */}
          {scheme.blocks && scheme.blocks.length > 0 && (
            <div className="p-8 space-y-6">
              {scheme.blocks.map((block: any, index: number) => {
                if (block.type === "heading") {
                  return (
                    <h2 key={index} className="text-xl sm:text-2xl font-bold text-gray-900 pt-2">
                      {block.value}
                    </h2>
                  );
                }
                if (block.type === "text") {
                  return (
                    <p key={index} className="text-gray-600 leading-relaxed text-base">
                      {block.value}
                    </p>
                  );
                }
                if (block.type === "link") {
                  return (
                    <a
                      key={index}
                      href={formatUrl(block.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-2xl px-5 py-4 transition-all group w-fit"
                    >
                      <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-green-700 group-hover:text-green-900 transition-colors">
                        {block.label || block.url}
                      </span>
                    </a>
                  );
                }
                if (block.type === "divider") {
                  return <hr key={index} className="border-gray-200 my-2" />;
                }
                return null;
              })}
            </div>
          )}
        </div>

        {/* Bottom Apply button */}
        {scheme.applyLink && scheme.applyLink !== '#' && (
          <div className="flex justify-center mb-8">
            <a
              href={formatUrl(scheme.applyLink)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3.5 rounded-2xl font-bold text-base hover:from-green-700 hover:to-teal-700 transition-all shadow-lg shadow-green-200"
            >
              <BadgeCheck className="w-5 h-5" /> Apply for This Scheme
            </a>
          </div>
        )}

        {/* Back Button Bottom */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/village-schemes")}
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Schemes
          </button>
        </div>

      </div>
    </div>
  );
}
