"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2, ClipboardList, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { TaskStatusChart } from "@/components/tasks/task-status-chart";
import { dashboardService } from "@/services/api";
import { formatDate } from "@/lib/utils";
import { statusStyles } from "@/utils/constants";

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    dashboardService.get().then(setData);
  }, []);

  const stats = [
    { label: "Всего сотрудников", value: data?.stats.employees || 0, icon: Users },
    { label: "Всего задач", value: data?.stats.tasks || 0, icon: ClipboardList },
    { label: "Активные задачи", value: data?.stats.activeTasks || 0, icon: Activity },
    { label: "Выполненные задачи", value: data?.stats.completedTasks || 0, icon: CheckCircle2 }
  ];

  return (
    <div className="page-shell">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-normal">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Оперативная сводка по сотрудникам, задачам и ближайшим срокам.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <div className="mt-2 text-3xl font-semibold">{item.value}</div>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-primary dark:bg-blue-500/15">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Последние добавленные задачи</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {(data?.recentTasks || []).map((task) => <TaskRow key={task.id} task={task} />)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Распределение задач</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskStatusChart data={data?.statusDistribution || []} />
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ближайшие дедлайны</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {(data?.upcomingTasks || []).map((task) => <TaskRow key={task.id} task={task} compact />)}
        </CardContent>
      </Card>
    </div>
  );
}

function TaskRow({ task }) {
  return (
    <div className="flex items-center gap-3 rounded-md border p-3">
      <Avatar src={task.employee?.avatar} name={task.employee?.fullName} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{task.title}</div>
        <div className="truncate text-xs text-muted-foreground">{task.employee?.fullName} · до {formatDate(task.deadline)}</div>
      </div>
      <Badge className={statusStyles[task.status]}>{task.status}</Badge>
    </div>
  );
}
