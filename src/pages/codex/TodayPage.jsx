import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import index from "../../../codex/index.json"; // pulls from your content index

export default function TodayPage() {
  const [target, setTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Example: map calendar days since launch to Codex days
    const startDate = new Date("2025-10-06"); // adjust to your real launch date
    const today = new Date();
    const diff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

    const week = "week-01";
    const day = index[week][diff] || index[week][0]; // fallback to day-01

    setTarget({ week, day });
  }, []);

  useEffect(() => {
    if (target) {
      navigate(`/codex/${target.week}/${target.day}`);
    }
  }, [target, navigate]);

  return <p>Loading today’s transmission...</p>;
}