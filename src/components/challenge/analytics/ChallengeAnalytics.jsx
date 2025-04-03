"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CalendarIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeOff,
  Hourglass,
  CalendarClock,
} from "lucide-react";
import BarChart from "@/components/charts/BarChart";
import { CalendarChart } from "@/components/charts/CalendarChart";

export default function AnalyticsPage({ challengeAnalyticsData }) {
  const challengeDetails = challengeAnalyticsData?.challengeDetails;

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

  const daysElapsed = Math.ceil(
    (new Date().getTime() - new Date(challengeDetails?.startDate).getTime()) /
      (1000 * 3600 * 24)
  );
  const now = new Date(new Date().toISOString());
  const endDate = new Date(challengeData?.endDate);
  const timeDifference = endDate - now;

  const timeLeft =
    timeDifference > 0 ? Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) : 0; // Return 0 if the date has passed

  const dailyProgress = challengeAnalyticsData?.dailyProgress?.map((item) => {
    return { day: item.day, tasks: item.tasks, taskDate: item.taskDates };
  });

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

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-4">
            How to Complete This Challenge
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Complete This Challenge</DialogTitle>
          </DialogHeader>
          <p>To finish this challenge, here’s what you need to do:</p>
          <ul>
            <li>
              <strong>Complete the tasks:</strong> You only need to do one task
              each day. No need to overdo it — even if you post multiple times,
              only one counts for that day.
            </li>
            <li>
              <strong>Stay consistent:</strong> Post for at least{" "}
              <strong>{challengeData.consistencyIncentiveDays}</strong> days in
              a row. Skip a day? No problem! Just keep the streak unbroken.
            </li>
          </ul>
          <p>
            Once you hit your task and streak goals, the challenge is yours! 🎉
          </p>
        </DialogContent>
      </Dialog>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <QuickStat
            title="Completion"
            value={`${Math.ceil(challengeData.completionPercentage)}%`}
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
            suffix="days"
          />

          <QuickStat
            title="Days Elapsed"
            value={daysElapsed}
            icon={<CalendarIcon className="w-4 h-4" />}
          />
          <QuickStat
            title="Time Left"
            value={timeLeft > 0 ? `${timeLeft} days` : "Challenge Ended"}
            icon={<Hourglass className="w-4 h-4 hover:animate-spin" />}
          />
          <QuickStat
            title="ConsistentDays"
            value={challengeData.consistencyIncentiveDays}
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
                    <Hourglass className="text-yellow-500" />
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
              <DetailItem
                title="Days Elapsed"
                value={`${daysElapsed} days`}
                icon={<CalendarClock />}
              />

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
            {/* Task Completion Progress */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Task Completion</h3>
              <div className="flex items-center space-x-4">
                <Progress
                  value={
                    (challengeData.completedTasks / challengeData.totalTasks) *
                    100
                  }
                  className="h-2"
                />
                <span className="text-sm text-muted-foreground">
                  {challengeData.completedTasks}/{challengeData.totalTasks}{" "}
                  tasks
                </span>
              </div>
              {challengeData.completedTasks < challengeData.totalTasks ? (
                <p className="mt-2 text-sm text-yellow-500">
                  You need to complete{" "}
                  <strong>
                    {challengeData.totalTasks - challengeData.completedTasks}{" "}
                    more tasks
                  </strong>
                  . Aim to complete{" "}
                  <strong>
                    {Math.ceil(
                      (challengeData.totalTasks -
                        challengeData.completedTasks) /
                        timeLeft
                    )}{" "}
                    tasks per day
                  </strong>{" "}
                  to finish on time.
                </p>
              ) : (
                <p className="mt-2 text-sm text-green-500">
                  🎉 All tasks completed! Great job!
                </p>
              )}
            </div>

            {/* Consistency Streak Progress */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Consistency Streak</h3>
              <div className="flex items-center space-x-4">
                <Progress
                  value={
                    (challengeData.currentStreak /
                      challengeData.consistencyIncentiveDays) *
                    100
                  }
                  className="h-2"
                />
                <span className="text-sm text-muted-foreground">
                  {challengeData.currentStreak}/
                  {challengeData.consistencyIncentiveDays} days
                </span>
              </div>
              {challengeData.currentStreak >=
              challengeData.consistencyIncentiveDays ? (
                <p className="mt-2 text-sm text-green-500">
                  🎉 You&apos;ve met the streak requirement. Keep it up
                </p>
              ) : (
                <p className="mt-2 text-sm text-yellow-500">
                  You need{" "}
                  <strong>
                    {challengeData.consistencyIncentiveDays -
                      challengeData.currentStreak}{" "}
                    more consecutive days
                  </strong>{" "}
                  to meet the streak requirement.
                </p>
              )}
            </div>

            {/* Time Remaining */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Time Remaining</h3>
              <p>
                You have <strong>{timeLeft} days</strong> left to complete the
                challenge.
              </p>
              {timeLeft <= 3 && (
                <p className="mt-2 text-sm text-red-500">
                  ⏳ Time is running out! Focus on completing your tasks and
                  maintaining your streak.
                </p>
              )}
            </div>

            {/* Dynamic Feedback */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                How You&apos;re Doing
              </h3>
              {challengeData.completedTasks >= challengeData.totalTasks &&
              challengeData.currentStreak >=
                challengeData.consistencyIncentiveDays ? (
                <p className="text-green-500">
                  🎉 Congratulations! You&apos;ve completed the challenge.
                </p>
              ) : challengeData.completedTasks >= challengeData.totalTasks ? (
                <p className="text-yellow-500">
                  👍 All tasks completed! Just maintain your streak to finish
                  the challenge.
                </p>
              ) : challengeData.currentStreak >=
                challengeData.consistencyIncentiveDays ? (
                <p className="text-yellow-500">
                  👍 Streak requirement met! Focus on completing the remaining
                  tasks.
                </p>
              ) : (
                <p className="text-red-500">
                  💪 Keep going! Focus on completing tasks and maintaining your
                  streak.
                </p>
              )}
            </div>

            {/* Completion Status */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Completion Status</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {challengeData.completedTasks >= challengeData.totalTasks ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-4 h-4 text-red-500" />
                  )}
                  <p>
                    Task Completion: {challengeData.completedTasks}/
                    {challengeData.totalTasks}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {challengeData.currentStreak >=
                  challengeData.consistencyIncentiveDays ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-4 h-4 text-red-500" />
                  )}
                  <p>
                    Consistency Streak: {challengeData.currentStreak}/
                    {challengeData.consistencyIncentiveDays} days
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function QuickStat({ title, value, subvalue, suffix = "", icon }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
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
        </TooltipTrigger>
        <TooltipContent>
          <p>This metric shows your {title.toLowerCase()}.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
