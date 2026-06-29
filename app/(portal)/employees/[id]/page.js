"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { employeeService } from "@/services/api";
import { formatDate } from "@/lib/utils";
import { priorityStyles, statusStyles } from "@/utils/constants";

export default function EmployeeProfilePage() {
  const params = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    employeeService.get(params.id).then(setEmployee);
  }, [params.id]);

  if (!employee) return <div className="page-shell text-sm text-muted-foreground">Загрузка...</div>;

  const completed = employee.tasks.filter((task) => task.status === "Выполнена").length;
  const active = employee.tasks.filter((task) => task.status !== "Выполнена").length;

  return (
    <div className="page-shell">
      <Button variant="ghost" className="mb-4" asChild>
        <Link href="/employees"><ArrowLeft className="h-4 w-4" />Назад к списку</Link>
      </Button>
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar src={employee.avatar} name={employee.fullName} className="h-28 w-28 text-2xl" />
              <h1 className="mt-4 text-xl font-semibold">{employee.fullName}</h1>
              <p className="text-sm text-muted-foreground">{employee.position}</p>
              <Badge className="mt-3 border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">{employee.department}</Badge>
            </div>
            <div className="mt-6 grid gap-3 text-sm">
              <InfoRow icon={MapPin} label="Кабинет" value={employee.office} />
              <InfoRow icon={Phone} label="Телефон" value={employee.phone} />
              <InfoRow icon={Mail} label="Email" value={employee.email} />
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">Активные задачи</p>
                  <div className="mt-2 text-3xl font-semibold">{active}</div>
                </div>
                <BriefcaseBusiness className="h-8 w-8 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">Выполненные задачи</p>
                  <div className="mt-2 text-3xl font-semibold">{completed}</div>
                </div>
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Назначенные задачи</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Срок</TableHead>
                    <TableHead>Приоритет</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employee.tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div className="font-medium">{task.title}</div>
                        <div className="max-w-xl truncate text-xs text-muted-foreground">{task.description}</div>
                      </TableCell>
                      <TableCell>{formatDate(task.deadline)}</TableCell>
                      <TableCell><Badge className={priorityStyles[task.priority]}>{task.priority}</Badge></TableCell>
                      <TableCell><Badge className={statusStyles[task.status]}>{task.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-md border p-3">
      <Icon className="h-4 w-4 text-primary" />
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate font-medium">{value}</div>
      </div>
    </div>
  );
}
