import fs from "fs";
import path from "path";

export async function getStaticPaths() {
  // Pre-generate paths for week-01/day-01 through day-07
  const paths = Array.from({ length: 7 }, (_, i) => ({
    params: { week: "week-01", day: `day-0${i + 1}` }
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), "codex", params.week, `${params.day}.json`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const transmission = JSON.parse(fileContents);

  return { props: { transmission } };
}

export default function TransmissionPage({ transmission }) {
  return (
    <main className="max-w-2xl mx-auto p-6 font-serif">
      <h1 className="text-2xl font-bold mb-4">
        Week {transmission.week}, Day {transmission.day}: {transmission.title}
      </h1>

      <p className="italic text-gray-600 mb-6">
        {transmission.openingSignal}
      </p>

      <div className="mb-6 whitespace-pre-line">
        {transmission.coreInsight}
      </div>

      <div className="bg-gray-100 p-4 rounded mb-6">
        <strong>Ritual Prompt:</strong>
        <p>{transmission.ritualPrompt}</p>
      </div>

      <p className="font-semibold text-indigo-600">
        {transmission.closingSeal}
      </p>
    </main>
  );
}