import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import index from "./index.json"; // ✅ fixed path

const TransmissionPage = () => {
  const { week, day } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const isPaidUser = localStorage.getItem("creatorPass") === "true";

    // ✅ Gate access: free users can only see week-01
    if (!isPaidUser && week !== "week-01") {
      navigate("/pricing");
      return;
    }

    // Validate that the requested week/day exists in index.json
    const weekDays = index[week];
    if (!weekDays || !weekDays.includes(day)) {
      setError("This transmission does not exist.");
      return;
    }

    // Load the JSON file dynamically
    import(`./${week}/${day}.json`) // ✅ fixed path
      .then((module) => {
        setContent(module.default);
      })
      .catch(() => {
        setError("Unable to load this transmission.");
      });
  }, [week, day, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white px-4 py-12">
        <main className="max-w-3xl mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Error</h1>
          <p className="text-gray-300">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/codex/archive")}
              className="px-4 py-2 rounded bg-gray-900 hover:bg-gray-800 text-[var(--vauntico-gold-text)] font-semibold transition"
            >
              Back to archive
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white px-4 py-12">
        <main className="max-w-3xl mx-auto p-6 text-center">
          <p className="text-gray-300">Loading transmission...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white px-4 py-12">
      <Helmet>
        <title>{content.title || "Transmission"} — Vauntico Codex</title>
        <meta
          name="description"
          content={content.description || "Daily transmission from the Ascension Codex."}
        />
      </Helmet>
      <main role="main" className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--vauntico-gold-text)]">
            {content.title || `${week} / ${day}`}
          </h1>
          <p className="text-gray-400 mt-2">{content.subtitle || ""}</p>
        </header>

        <article className="prose prose-invert max-w-none">
          {content.body ? (
            <div className="whitespace-pre-wrap leading-relaxed">{content.body}</div>
          ) : (
            <p>No content found for this transmission.</p>
          )}
        </article>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/codex/archive")}
            className="px-4 py-2 rounded bg-gray-900 hover:bg-gray-800 text-[var(--vauntico-gold-text)] font-semibold transition"
          >
            View archive
          </button>
          <button
            onClick={() => navigate("/codex/today")}
            className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-white font-semibold transition"
          >
            Go to today
          </button>
        </div>
      </main>
    </div>
  );
};

export default TransmissionPage;