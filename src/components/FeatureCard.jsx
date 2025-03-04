import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, ChartBarIncreasing, Swords, Users } from "lucide-react";
function FeatureCard() {
  const cardContent = [
    {
      title: "Set Your Challenge",
      content:
        "Create a personalized challenge that aligns with your goals and interests.",
      icon: <Swords />,
      iconColor:
        "bg-green-500 bg-opacity-15 w-12 h-12 rounded-md flex items-center justify-center mb-2",
    },
    {
      title: "Track Your Progress",
      content:
        "Easily log your achievements, monitor your growth, and see how far you have come with visual progress trackers.",
      icon: <ChartBarIncreasing />,
      iconColor:
        "bg-green-500 bg-opacity-15 w-12 h-12 rounded-md flex items-center justify-center mb-2",
    },
    {
      title: "Stay Motivated",
      content:
        "Get reminders, earn streaks and badges, and celebrate every milestone to keep your momentum going.",
      icon: <Award />,
      iconColor:
        "bg-green-500 bg-opacity-15 w-12 h-12 rounded-md flex items-center justify-center mb-2",
    },
    {
      title: "Join a Community",
      content:
        "Share your journey, get feedback, and connect with others working toward similar goals. Together, it&apos;s easier to stay consistent.",
      icon: <Users />,
      iconColor:
        "bg-green-500 bg-opacity-15 w-12 h-12 rounded-md flex items-center justify-center mb-2",
    },
  ];
  return (
    <>
      {cardContent.map((card, index) => (
        <Card
          key={index}
          className="w-full md:w-96 bg-gradient-to-tr from-green-500/10 to-neutral-950/10 "
        >
          <CardHeader>
            <div className={card.iconColor}>{card.icon}</div>
            <CardTitle>{card.title}</CardTitle>
          </CardHeader>
          <CardContent>{card.content}</CardContent>
        </Card>
      ))}
    </>
  );
}

export default FeatureCard;
