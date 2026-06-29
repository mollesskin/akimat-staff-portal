"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Edit, Eye, Plus, Search, Trash2 } from "lucide-react";
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
import { EmployeeForm } from "@/components/employees/employee-form";
import { useToast } from "@/hooks/use-toast";
import { employeeService } from "@/services/api";
import { departments } from "@/utils/constants";

export default function EmployeesPage() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ search: "", department: "", page: 1, pageSize: 8 });
  const [modal, setModal] = useState({ open: false, employee: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const params = useMemo(() => ({
    search: filters.search,
    department: filters.department,
    page: String(filters.page),
    pageSize: String(filters.pageSize)
  }), [filters]);

  const load = () => {
    employeeService.list(params).then((response) => {
      setEmployees(response.items);
      setTotal(response.total);
    });
  };

  useEffect(() => {
    load();
  }, [params]);

  const save = async (data) => {
    if (modal.employee) {
      await employeeService.update(modal.employee.id, data);
      toast("Данные сотрудника обновлены");
    } else {
      await employeeService.create(data);
      toast("Сотрудник добавлен");
    }
    setModal({ open: false, employee: null });
    load();
  };

  const remove = async () => {
    await employeeService.remove(deleteTarget.id);
    toast("Сотрудник удален");
    setDeleteTarget(null);
    load();
  };

  return (
    <div className="page-shell">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Сотрудники</h1>
          <p className="text-sm text-muted-foreground">Электронный справочник сотрудников аппарата.</p>
        </div>
        <Button onClick={() => setModal({ open: true, employee: null })}>
          <Plus className="h-4 w-4" />
          Добавить
        </Button>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_260px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Поиск по ФИО" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value, page: 1 })} />
            </div>
            <Select value={filters.department} onChange={(event) => setFilters({ ...filters, department: event.target.value, page: 1 })}>
              <option value="">Все отделы</option>
              {departments.map((department) => <option key={department}>{department}</option>)}
            </Select>
          </div>
        </CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Сотрудник</TableHead>
                <TableHead>Отдел</TableHead>
                <TableHead>Кабинет</TableHead>
                <TableHead>Контакты</TableHead>
                <TableHead className="w-36 text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={employee.avatar} name={employee.fullName} />
                      <div>
                        <div className="font-medium">{employee.fullName}</div>
                        <div className="text-xs text-muted-foreground">{employee.position}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">{employee.department}</Badge></TableCell>
                  <TableCell>{employee.office}</TableCell>
                  <TableCell>
                    <div className="text-sm">{employee.phone}</div>
                    <div className="text-xs text-muted-foreground">{employee.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/employees/${employee.id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setModal({ open: true, employee })}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(employee)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination page={filters.page} pageSize={filters.pageSize} total={total} onPageChange={(page) => setFilters({ ...filters, page })} />
      </Card>
      <Dialog open={modal.open} title={modal.employee ? "Редактировать сотрудника" : "Добавить сотрудника"} onOpenChange={(open) => setModal({ open, employee: open ? modal.employee : null })}>
        <EmployeeForm initialData={modal.employee} onSubmit={save} onCancel={() => setModal({ open: false, employee: null })} />
      </Dialog>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        description={`Удалить сотрудника ${deleteTarget?.fullName}? Назначенные задачи также будут удалены.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </div>
  );
}
