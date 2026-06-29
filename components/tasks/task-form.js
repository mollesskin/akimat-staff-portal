"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { taskPriorities, taskStatuses } from "@/utils/constants";

const emptyForm = {
  title: "",
  description: "",
  employeeId: "",
  deadline: "",
  priority: "Средний",
  status: "Новая"
};

export function TaskForm({ initialData, employees, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(
      initialData
        ? {
            title: initialData.title || "",
            description: initialData.description || "",
            employeeId: initialData.employeeId || employees[0]?.id || "",
            deadline: initialData.deadline ? initialData.deadline.slice(0, 10) : "",
            priority: initialData.priority || "Средний",
            status: initialData.status || "Новая"
          }
        : { ...emptyForm, employeeId: employees[0]?.id || "" }
    );
  }, [initialData, employees]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <Input required placeholder="Название задачи" value={form.title} onChange={(event) => update("title", event.target.value)} />
      <Textarea required placeholder="Описание" value={form.description} onChange={(event) => update("description", event.target.value)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select required value={form.employeeId} onChange={(event) => update("employeeId", event.target.value)}>
          {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.fullName}</option>)}
        </Select>
        <Input required type="date" value={form.deadline} onChange={(event) => update("deadline", event.target.value)} />
        <Select value={form.priority} onChange={(event) => update("priority", event.target.value)}>
          {taskPriorities.map((priority) => <option key={priority}>{priority}</option>)}
        </Select>
        <Select value={form.status} onChange={(event) => update("status", event.target.value)}>
          {taskStatuses.map((status) => <option key={status}>{status}</option>)}
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button>
        <Button type="submit">Сохранить</Button>
      </div>
    </form>
  );
}
