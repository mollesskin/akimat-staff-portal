import { NextResponse } from "next/server";
import { ensureSeed } from "@/lib/ensure-seed";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  await ensureSeed();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const department = searchParams.get("department") || "";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 8);

  const where = {
    AND: [
      search ? { fullName: { contains: search, mode: "insensitive" } } : {},
      department ? { department } : {}
    ]
  };

  const [items, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      include: { tasks: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.employee.count({ where })
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}

export async function POST(request) {
  const data = await request.json();
  const employee = await prisma.employee.create({ data });
  return NextResponse.json(employee, { status: 201 });
}
