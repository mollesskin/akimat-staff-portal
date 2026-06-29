"use client";

import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { departments } from "@/utils/constants";

const emptyForm = {
  fullName: "",
  position: "",
  department: departments[0],
  office: "",
  phone: "",
  email: "",
  avatar: ""
};

export function EmployeeForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(
      initialData
        ? {
            fullName: initialData.fullName || "",
            position: initialData.position || "",
            department: initialData.department || departments[0],
            office: initialData.office || "",
            phone: initialData.phone || "",
            email: initialData.email || "",
            avatar: initialData.avatar || ""
          }
        : emptyForm
    );
  }, [initialData]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("avatar", reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="flex items-center gap-4">
        <Avatar src={form.avatar} name={form.fullName} className="h-16 w-16" />
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent">
          <Upload className="h-4 w-4" />
          Загрузить аватар
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input required placeholder="ФИО" value={form.fullName} onChange={(event) => update("fullName", event.target.value)} />
        <Input required placeholder="Должность" value={form.position} onChange={(event) => update("position", event.target.value)} />
        <Select value={form.department} onChange={(event) => update("department", event.target.value)}>
          {departments.map((department) => <option key={department}>{department}</option>)}
        </Select>
        <Input required placeholder="Кабинет" value={form.office} onChange={(event) => update("office", event.target.value)} />
        <Input required placeholder="Телефон" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
        <Input required type="email" placeholder="Email" value={form.email} onChange={(event) => update("email", event.target.value)} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button>
        <Button type="submit">Сохранить</Button>
      </div>
    </form>
  );
}
