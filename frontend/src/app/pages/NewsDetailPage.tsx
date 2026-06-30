import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchNewsById } from "../../services/api";
import TableRenderer from "../components/TableRenderer";
import { ArrowLeft, Newspaper, Calendar, Tag, ExternalLink, Loader2, AlertCircle } from "lucide-react";

const formatUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

export function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetchNewsById(id);
        if (response.success) {
          setNews(response.data);
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
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-500 text-lg font-medium">Loading news...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700">News Not Found</h3>
          <p className="text-gray-500">This news article may have been removed.</p>
          <button
            onClick={() => navigate("/news")}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to News
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
          onClick={() => navigate("/news")}
          className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to News
        </button>

        {/* Header Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl p-8 mb-8 shadow-xl shadow-blue-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <Newspaper className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {news.category}
                </span>
                {news.isNewPost && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">NEW</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{news.title}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm border-t border-white/20 pt-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {news.date}
            </span>
            {news.source && (
              <span className="flex items-center gap-1.5">
                <Newspaper className="w-4 h-4" /> {news.source}
              </span>
            )}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Summary / Intro */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Summary</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{news.content}</p>
          </div>

          {/* Rich Content Blocks */}
          {news.blocks && news.blocks.length > 0 && (
            <div className="p-8 space-y-6">
              {news.blocks.map((block: any, index: number) => {
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
                      className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl px-5 py-4 transition-all group w-fit"
                    >
                      <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-blue-700 group-hover:text-blue-900 transition-colors">
                        {block.label || block.url}
                      </span>
                    </a>
                  );
                }
                if (block.type === "divider") {
                  return <hr key={index} className="border-gray-200 my-2" />;
                }
                if (block.type === "table") {
                  return <TableRenderer key={index} tableData={block.tableData} />;
                }
                return null;
              })}
            </div>
          )}
        </div>

        {/* Back Button Bottom */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/news")}
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All News
          </button>
        </div>

      </div>
    </div>
  );
}
