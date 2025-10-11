import index from "./index.json"; // ✅ fixed path
import { Link } from "react-router-dom";

export default function ArchivePage() {
  // 🔑 Replace this with your real auth/subscription check
  const isPaidUser = false; // set true if user has Creator Pass

  // If free, only show week-01
  const visibleWeeks = isPaidUser
    ? Object.keys(index) // all weeks
    : ["week-01"];       // free tier only

  return (
    <main className="max-w-3xl mx-auto p-6 font-serif">
      <h1 className="text-3xl font-bold mb-6">Codex Archive</h1>
      <p className="mb-8 text-gray-600">
        {isPaidUser
          ? "Browse the full Codex archive."
          : "You have access to Week One. Unlock the Creator Pass to explore the full Codex."}
      </p>

      {visibleWeeks.map((week) => (
        <div key={week} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 capitalize">{week}</h2>
          <ul className="grid grid-cols-2 gap-3">
            {index[week].map((day) => (
              <li key={day}>
                <Link
                  to={`/codex/${week}/${day}`}
                  className="block p-3 rounded bg-gray-900 hover:bg-gray-800 transition text-white"
                >
                  {day.replace("day-", "Day ")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {!isPaidUser && (
        <div className="mt-8 text-center">
          <Link
            to="/pricing"
            className="inline-block px-6 py-3 rounded bg-[var(--vauntico-gold)] text-black font-semibold hover:bg-[var(--vauntico-gold-hover)] transition"
          >
            Unlock Full Codex
          </Link>
        </div>
      )}
    </main>
  );
}