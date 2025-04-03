"use client";
import { ResponsiveCalendar } from "@nivo/calendar";
import { useEffect, useState } from "react";

export const CalendarChart = ({ dailyProgress, from, to }) => {
  if (!dailyProgress) {
    return null;
  }

  // State for screen width
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 640);
    checkScreenSize(); // Run initially
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Data for the calendar
  const data = dailyProgress?.map((item) => ({
    day: new Date(item.taskDate[0])?.toISOString().split("T")[0], // Convert to YYYY-MM-DD
    value: item.tasks, // Keep the tasks count as is
  }));
  const startingFrom = new Date(from)?.toISOString().split("T")[0];
  const endingTo = new Date(to)?.toISOString().split("T")[0];

  const isDarkMode =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const tooltipStyles = {
    container: {
      background: `hsl(var(${isDarkMode ? "--popover" : "--background"}, 1))`,
      color: `hsl(var(${
        isDarkMode ? "--popover-foreground" : "--foreground"
      }, 1))`,
      boxShadow: `0px 4px 6px rgba(0, 0, 0, 0.1)`,
      borderRadius: "var(--radius)",
      padding: "0.5rem",
    },
  };

  return (
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
      <ResponsiveCalendar
        data={data}
        from={startingFrom}
        to={endingTo}
        emptyColor={isDarkMode ? "#0a0a0a" : "#F3F4F6"}
        colors={["#d6e685", "#8cc665", "#44a340", "#1e6823"]}
        margin={{ top: 20, right: 10, bottom: 20, left: 10 }}
        yearSpacing={40}
        monthBorderColor={isDarkMode ? "#262626" : "#E5E7EB"}
        dayBorderWidth={1}
        dayBorderColor={isDarkMode ? "#262626" : "#D1D5DB"}
        legends={
          isSmallScreen
            ? []
            : [
                {
                  anchor: "bottom-right",
                  direction: "row",
                  translateY: 36,
                  itemCount: 4,
                  itemWidth: 44,
                  itemHeight: 36,
                  itemsSpacing: 15,
                  itemDirection: "right-to-left",
                },
              ]
        }
        theme={{
          tooltip: tooltipStyles,
        }}
      />
    </div>
  );
};
