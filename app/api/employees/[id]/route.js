import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request, { params }) {
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
    include: { tasks: { orderBy: { deadline: "asc" } } }
  });

  if (!employee) return NextResponse.json({ message: "Сотрудник не найден" }, { status: 404 });
  return NextResponse.json(employee);
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const employee = await prisma.employee.update({
    where: { id: params.id },
    data
  });
  return NextResponse.json(employee);
}

export async function DELETE(_request, { params }) {
  await prisma.employee.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
