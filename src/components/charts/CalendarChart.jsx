"use client";

import { ResponsiveCalendar } from "@nivo/calendar";

export const CalendarChart = ({ data }) => {
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
    <div className="h-56 w-full ">
      <ResponsiveCalendar
        data={data}
        from="2024-12-01"
        to="2024-12-31"
        emptyColor={isDarkMode ? "#0a0a0a" : "#F3F4F6"}
        colors={["#d6e685", "#8cc665", "#44a340", "#1e6823"]}
        margin={{ top: 40, right: 40, bottom: 20, left: 40 }}
        yearSpacing={40}
        monthBorderColor={isDarkMode ? "#262626" : "#E5E7EB"}
        dayBorderWidth={1}
        dayBorderColor={isDarkMode ? "#262626" : "#D1D5DB"}
        legends={[
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
        ]}
        theme={{
          tooltip: tooltipStyles,
        }}
      />
    </div>
  );
};
