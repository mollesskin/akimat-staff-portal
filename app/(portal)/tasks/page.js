"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TaskForm } from "@/components/tasks/task-form";
import { useToast } from "@/hooks/use-toast";
import { employeeService, taskService } from "@/services/api";
import { formatDate } from "@/lib/utils";
import { priorityStyles, taskStatuses } from "@/utils/constants";

export default function TasksPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ search: "", employeeId: "", status: "", sort: "asc", page: 1, pageSize: 8 });
  const [modal, setModal] = useState({ open: false, task: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const params = useMemo(() => ({
    search: filters.search,
    employeeId: filters.employeeId,
    status: filters.status,
    sort: filters.sort,
    page: String(filters.page),
    pageSize: String(filters.pageSize)
  }), [filters]);

  const load = () => {
    taskService.list(params).then((response) => {
      setTasks(response.items);
      setTotal(response.total);
    });
  };

  useEffect(() => {
    employeeService.list({ page: "1", pageSize: "100" }).then((response) => setEmployees(response.items));
  }, []);

  useEffect(() => {
    load();
  }, [params]);

  const save = async (data) => {
    if (modal.task) {
      await taskService.update(modal.task.id, data);
      toast("Задача обновлена");
    } else {
      await taskService.create(data);
      toast("Задача создана");
    }
    setModal({ open: false, task: null });
    load();
  };

  const updateStatus = async (task, status) => {
    await taskService.update(task.id, { status });
    toast("Статус задачи изменен");
    load();
  };

  const remove = async () => {
    await taskService.remove(deleteTarget.id);
    toast("Задача удалена");
    setDeleteTarget(null);
    load();
  };

  return (
    <div className="page-shell">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Задачи</h1>
          <p className="text-sm text-muted-foreground">Постановка поручений, контроль сроков и статусов исполнения.</p>
        </div>
        <Button onClick={() => setModal({ open: true, task: null })} disabled={employees.length === 0}>
          <Plus className="h-4 w-4" />
          Создать
        </Button>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3 xl:grid-cols-[1fr_260px_220px_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Поиск задач" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value, page: 1 })} />
            </div>
            <Select value={filters.employeeId} onChange={(event) => setFilters({ ...filters, employeeId: event.target.value, page: 1 })}>
              <option value="">Все сотрудники</option>
              {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.fullName}</option>)}
            </Select>
            <Select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value, page: 1 })}>
              <option value="">Все статусы</option>
              {taskStatuses.map((status) => <option key={status}>{status}</option>)}
            </Select>
            <Select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value, page: 1 })}>
              <option value="asc">Срок: ближайшие</option>
              <option value="desc">Срок: дальние</option>
            </Select>
          </div>
        </CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Задача</TableHead>
                <TableHead>Ответственный</TableHead>
                <TableHead>Срок</TableHead>
                <TableHead>Приоритет</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-28 text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div className="font-medium">{task.title}</div>
                    <div className="max-w-md truncate text-xs text-muted-foreground">{task.description}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={task.employee?.avatar} name={task.employee?.fullName} />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{task.employee?.fullName}</div>
                        <div className="truncate text-xs text-muted-foreground">{task.employee?.department}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(task.deadline)}</TableCell>
                  <TableCell><Badge className={priorityStyles[task.priority]}>{task.priority}</Badge></TableCell>
                  <TableCell>
                    <Select className="h-9 min-w-32" value={task.status} onChange={(event) => updateStatus(task, event.target.value)}>
                      {taskStatuses.map((status) => <option key={status}>{status}</option>)}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setModal({ open: true, task })}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(task)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination page={filters.page} pageSize={filters.pageSize} total={total} onPageChange={(page) => setFilters({ ...filters, page })} />
      </Card>
      <Dialog open={modal.open} title={modal.task ? "Редактировать задачу" : "Создать задачу"} onOpenChange={(open) => setModal({ open, task: open ? modal.task : null })}>
        <TaskForm initialData={modal.task} employees={employees} onSubmit={save} onCancel={() => setModal({ open: false, task: null })} />
      </Dialog>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        description={`Удалить задачу «${deleteTarget?.title}»?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </div>
  );
}
