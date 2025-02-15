import React from "react";
import { ResponsiveBar } from "@nivo/bar";

const tooltipStyles = {
  container: {
    background: "#161716",
    color: "#d2d4d2",
    boxShadow: `0px 4px 6px rgba(0, 0, 0, 0.1)`,
    borderRadius: "var(--radius)",
    padding: "0.5rem",
  },
};
const BarChart = ({ dailyProgress }) => {
  if (!dailyProgress) {
    return <>Loading....</>;
  }
  const formattedData = dailyProgress?.map((item) => ({
    day: `Day ${item.day}`, // Convert the day to a string if needed
    tasks: item.tasks, // Keep the tasks count as is
  }));

  console.log(formattedData);
  return (
    <div style={{ height: 400 }}>
      <ResponsiveBar
        data={formattedData}
        keys={["tasks"]}
        indexBy="day"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: "accent" }} // Use a predefined color scheme
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Day",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Tasks",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        theme={{
          tooltip: tooltipStyles,
        }}
      />
    </div>
  );
};

export default BarChart;
