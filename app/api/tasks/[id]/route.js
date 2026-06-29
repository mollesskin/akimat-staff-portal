import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request, { params }) {
  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: { employee: true }
  });

  if (!task) return NextResponse.json({ message: "Задача не найдена" }, { status: 404 });
  return NextResponse.json(task);
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const task = await prisma.task.update({
    where: { id: params.id },
    data: { ...data, deadline: data.deadline ? new Date(data.deadline) : undefined },
    include: { employee: true }
  });
  return NextResponse.json(task);
}

export async function DELETE(_request, { params }) {
  await prisma.task.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
