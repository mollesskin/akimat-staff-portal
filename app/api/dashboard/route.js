import { NextResponse } from "next/server";
import { ensureSeed } from "@/lib/ensure-seed";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await ensureSeed();
  const [employees, tasks, activeTasks, completedTasks, recentTasks, upcomingTasks, grouped] = await Promise.all([
    prisma.employee.count(),
    prisma.task.count(),
    prisma.task.count({ where: { status: { in: ["Новая", "В работе"] } } }),
    prisma.task.count({ where: { status: "Выполнена" } }),
    prisma.task.findMany({ include: { employee: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.task.findMany({
      include: { employee: true },
      where: { status: { not: "Выполнена" } },
      orderBy: { deadline: "asc" },
      take: 6
    }),
    prisma.task.groupBy({ by: ["status"], _count: { status: true } })
  ]);

  return NextResponse.json({
    stats: { employees, tasks, activeTasks, completedTasks },
    recentTasks,
    upcomingTasks,
    statusDistribution: grouped.map((item) => ({ status: item.status, count: item._count.status }))
  });
}
