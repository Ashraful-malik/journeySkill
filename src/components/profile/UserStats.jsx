import React from "react";

const Stats = () => {
  const stats = [
    { label: "Challenges", value: 0 },
    { label: "Followers", value: 0 },
    { label: "Following", value: 0 },
    { label: "Posts", value: 0 },
  ];

  return (
    <div className="other-details flex  gap-4 font-semibold mt-4 dark:text-neutral-300 flex-wrap ">
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
