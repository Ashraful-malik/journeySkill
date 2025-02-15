"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import {
  CalendarIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeOff,
} from "lucide-react";
import BarChart from "@/components/charts/BarChart";
import { CalendarChart } from "@/components/charts/CalendarChart";

// This would typically come from a database or API

export default function AnalyticsPage({ challengeAnalyticsData }) {
  const challengeDetails = challengeAnalyticsData?.challengeDetails;

  // overview
  const challengeData = {
    challengeName: challengeDetails?.challengeName,
    totalTasks: challengeDetails?.totalTasks,
    completedTasks: challengeDetails?.completedTasks,
    completionPercentage: challengeDetails?.completionPercentage,
    currentStreak: challengeDetails?.currentStreak,
    consistencyIncentiveDays: challengeDetails?.consistencyIncentiveDays,
    isCompleted: challengeDetails?.isCompleted,
    lastActivityDate: new Date(
      challengeDetails?.lastActivityDate
    ).toLocaleDateString(),
    completionDate: challengeAnalyticsData?.completionDate || null,
    isPublic: challengeDetails?.isPublic,
    startDate: new Date(challengeDetails?.startDate).toLocaleDateString(),
    endDate: new Date(challengeDetails?.endDate).toDateString(),
    viewCount: challengeAnalyticsData?.viewCount || 0,
  };

  // daily progress details form barChart and calendarChart
  const dailyProgress = challengeAnalyticsData?.dailyProgress?.map((item) => {
    return { day: item.day, tasks: item.tasks, taskDate: item.taskDates };
  });
  // calender chart data
  const daysElapsed = Math.ceil(
    (new Date().getTime() - new Date(challengeDetails?.startDate).getTime()) /
      (1000 * 3600 * 24)
  );

  return (
    <div className="container mx-auto px-4 py-8 lg:px-0">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {challengeData.challengeName}
        </h1>
        <div className="flex items-center space-x-2">
          {new Date() > new Date(challengeDetails?.endDate) &&
          !challengeData.isCompleted ? (
            <Badge variant="destructive">Challenge Ended</Badge>
          ) : (
            <Badge
              variant={challengeData.isCompleted ? "default" : "secondary"}
            >
              {challengeData.isCompleted ? "Completed" : "In Progress"}
            </Badge>
          )}

          {challengeData.isPublic && (
            <Badge variant="outline" className="flex items-center">
              <EyeIcon className="w-3 h-3 mr-1" />
              Public
            </Badge>
          )}
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <QuickStat
            title="Completion"
            value={`${challengeData.completionPercentage}%`}
            subvalue={
              <Progress
                value={challengeData.completionPercentage}
                className="mt-2"
              />
            }
          />
          <QuickStat
            title="Tasks Completed"
            value={`${challengeData.completedTasks}/${challengeData.totalTasks}`}
          />
          <QuickStat
            title="Current Streak"
            value={challengeData.currentStreak}
            suffix=" days"
          />
          <QuickStat
            title="Views"
            value={challengeData.viewCount}
            icon={<EyeIcon className="w-4 h-4" />}
          />
          <QuickStat
            title="Days Elapsed"
            value={daysElapsed}
            icon={<CalendarIcon className="w-4 h-4" />}
          />
          <QuickStat
            title="End Date"
            value={challengeData.endDate}
            icon={<CalendarIcon className="w-4 h-4" />}
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Progress</h2>
        <Card>
          <CardHeader>
            <CardTitle>Daily Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart dailyProgress={dailyProgress} />
          </CardContent>
        </Card>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Activity Heatmap</h2>
        <Card>
          <CardContent>
            <CalendarChart
              dailyProgress={dailyProgress}
              from={challengeDetails?.startDate}
              to={challengeDetails?.endDate}
            />
          </CardContent>
        </Card>
      </section>
      {/* challenge details */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Challenge Details</h2>
        <Card>
          <CardContent className="pt-6">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailItem
                icon={<CalendarIcon />}
                title="Start Date"
                value={challengeData.startDate}
              />
              <DetailItem
                icon={<CalendarIcon />}
                title="Last Activity"
                value={challengeData.lastActivityDate}
              />
              <DetailItem
                icon={
                  new Date() > new Date(challengeDetails?.endDate) &&
                  !challengeDetails?.isCompleted ? (
                    <XCircleIcon className="text-red-500" />
                  ) : challengeData.isCompleted ? (
                    <CheckCircleIcon className="text-green-500" />
                  ) : (
                    <XCircleIcon className="text-red-500" />
                  )
                }
                title="Status"
                value={
                  new Date() > new Date(challengeDetails?.endDate) &&
                  !challengeDetails?.isCompleted
                    ? "Challenge Ended"
                    : challengeData.isCompleted
                    ? "Completed"
                    : "In Progress"
                }
              />

              {challengeData.completionDate && (
                <DetailItem
                  icon={<CalendarIcon />}
                  title="Completion Date"
                  value={new Date(
                    challengeData.completionDate
                  ).toLocaleDateString()}
                />
              )}
              <DetailItem title="Days Elapsed" value={`${daysElapsed} days`} />
              <DetailItem
                title="Visibility"
                value={challengeData.isPublic ? "Public" : "Private"}
                icon={
                  challengeData.isPublic ? (
                    <EyeIcon className="text-green-500" />
                  ) : (
                    <EyeOff className="text-red-500" />
                  )
                }
              />
            </dl>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Insights</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="mb-2">
              <strong>Consistency Incentive:</strong> You need to post for at
              least every{" "}
              <span className="bg-card-foreground text-card px-2 rounded-sm">
                {challengeData.consistencyIncentiveDays}
              </span>{" "}
              days to maintain consistency.
            </p>
            <p className="mb-2">
              <strong>Completion Rate:</strong> You're completing an average of{" "}
              {(challengeData.completedTasks / daysElapsed).toFixed(1)} tasks
              per day.
            </p>
            <p>
              <strong>Engagement:</strong> Your challenge has been viewed{" "}
              {challengeData.viewCount} times.
              {challengeData.isPublic
                ? " Keep it up!"
                : " Consider making it public to increase engagement."}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function QuickStat({ title, value, subvalue, suffix = "", icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {suffix}
        </div>
        {subvalue && (
          <div className="text-xs text-muted-foreground">{subvalue}</div>
        )}
      </CardContent>
    </Card>
  );
}

function DetailItem({ icon, title, value }) {
  return (
    <div className="flex items-center space-x-2">
      {icon && <div className="flex-shrink-0">{icon}</div>}
      <div>
        <dt className="text-sm font-medium">{title}</dt>
        <dd className="mt-1 text-sm ">{value}</dd>
      </div>
    </div>
  );
}
