import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { fetchJobById } from "../../services/api";
import TableRenderer from "../components/TableRenderer";
import {
  ArrowLeft, Briefcase, Calendar, MapPin, BadgeCheck, Users,
  Banknote, GraduationCap, ExternalLink, Loader2, AlertCircle, Tag
} from "lucide-react";

const formatUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetchJobById(id);
        if (response.success) {
          setJob(response.data);
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
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          <p className="text-gray-500 text-lg font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700">Job Not Found</h3>
          <p className="text-gray-500">This job posting may have been removed.</p>
          <button
            onClick={() => navigate("/government-jobs")}
            className="bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* Back Button */}
        <button
          onClick={() => navigate("/government-jobs")}
          className="flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-800 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Government Jobs
        </button>

        {/* Header Card */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-3xl md:p-8 p-4 mb-4 md:mb-8 shadow-xl shadow-orange-100">
          <div className="flex items-start gap-4 md:mb-6">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {job.category}
                </span>
                {job.isNewPost && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">NEW</span>
                )}
              </div>
              <h1 className="text-xl sm:text-3xl font-bold leading-tight">{job.title}</h1>
              <p className="text-white/80 mt-1 text-lg font-medium">{job.organization}</p>
            </div>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-8">
          {[
            { icon: <Users className="w-5 h-5 text-orange-500" />, label: "Total Posts", value: job.posts },
            { icon: <Calendar className="w-5 h-5 text-red-500" />, label: "Last Date", value: job.lastDate },
            { icon: <MapPin className="w-5 h-5 text-blue-500" />, label: "Location", value: job.location },
            { icon: <Banknote className="w-5 h-5 text-green-500" />, label: "Salary", value: job.salary },
            { icon: <GraduationCap className="w-5 h-5 text-purple-500" />, label: "Qualification", value: job.qualification },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
              <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{value}</p>
              </div>
            </div>
          ))}

          {/* Apply Button card */}
          {job.applyLink && job.applyLink !== '#' && (
            <a
              href={formatUrl(job.applyLink)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-600 transition-all text-white rounded-2xl p-4 flex items-center justify-center gap-2 font-bold text-sm shadow-lg shadow-orange-100"
            >
              <BadgeCheck className="w-5 h-5" /> Apply Now
            </a>
          )}
        </div>

        {/* Rich Content Blocks */}
        {job.blocks && job.blocks.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="px-8 pt-6 pb-2 border-b border-gray-100">
              <h2 className="text-sm font-bold text-orange-600 uppercase tracking-wider">Job Details</h2>
            </div>
            <div className="p-4 space-y-6">
              {job.blocks.map((block: any, index: number) => {
                if (block.type === "heading") {
                  return (
                    <h2 key={index} className="text-xl sm:text-2xl font-bold text-gray-900 pt-2">
                      {block.value}
                    </h2>
                  );
                }
                if (block.type === "text") {
                  return (
                    <p key={index} className="text-gray-600 leading-relaxed text-base whitespace-pre-line">
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
                      className="flex items-center gap-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-2xl px-5 py-4 transition-all group w-fit"
                    >
                      <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-orange-700 group-hover:text-orange-900 transition-colors">
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
          </div>
        )}

        {/* Bottom Apply button */}
        {job.applyLink && job.applyLink !== '#' && (
          <div className="flex justify-center mb-8">
            <a
              href={formatUrl(job.applyLink)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-3.5 rounded-2xl font-bold text-base hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-200"
            >
              <BadgeCheck className="w-5 h-5" /> Apply for This Job
            </a>
          </div>
        )}

        {/* Back Button Bottom */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/government-jobs")}
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Jobs
          </button>
        </div>

      </div>
    </div>
  );
}
