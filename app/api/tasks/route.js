import { NextResponse } from "next/server";
import { ensureSeed } from "@/lib/ensure-seed";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  await ensureSeed();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const employeeId = searchParams.get("employeeId") || "";
  const status = searchParams.get("status") || "";
  const sort = searchParams.get("sort") || "asc";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 8);

  const where = {
    AND: [
      search ? { title: { contains: search, mode: "insensitive" } } : {},
      employeeId ? { employeeId } : {},
      status ? { status } : {}
    ]
  };

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: { employee: true },
      orderBy: { deadline: sort === "desc" ? "desc" : "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.task.count({ where })
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(request) {
  const data = await request.json();
  const task = await prisma.task.create({
    data: { ...data, deadline: new Date(data.deadline) },
    include: { employee: true }
  });
  return NextResponse.json(task, { status: 201 });
}
