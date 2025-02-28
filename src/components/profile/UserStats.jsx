import { useUserStats } from "@/context/UserStatsContext";
import React from "react";

const Stats = () => {
  const { totalChallenges, totalPosts } = useUserStats();
  const stats = [
    { label: "Challenges", value: totalChallenges },
    { label: "Posts", value: totalPosts },
  ];

  return (
    <div className="other-details flex  gap-4 font-semibold mt-2 dark:text-neutral-300 flex-wrap ">
      {stats.map(({ label, value }) => (
        <div key={label} className="flex space-x-2   cursor-pointer ">
          <p className="capitalize">{label}</p>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
};

export default Stats;
