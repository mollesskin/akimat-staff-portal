"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, Lock, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState({ login: "admin", password: "admin", role: "Администратор" });

  const submit = (event) => {
    event.preventDefault();
    localStorage.setItem("akimat-user", JSON.stringify(form));
    toast("Вход выполнен");
    router.replace("/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border bg-card shadow-soft lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex min-h-[520px] flex-col justify-between bg-primary p-8 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white/15">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="font-semibold">Akimat Staff Portal</div>
              <div className="text-sm text-blue-100">Внутренний портал</div>
            </div>
          </div>
          <div className="max-w-lg">
            <h1 className="text-4xl font-semibold leading-tight tracking-normal">КГУ «Аппарат акима города Щучинска Бурабайского района»</h1>
            <p className="mt-4 text-blue-100">Единое рабочее пространство для сотрудников, задач, сроков исполнения и справочной информации.</p>
          </div>
          <div className="grid gap-3 text-sm text-blue-100 sm:grid-cols-3">
            <div className="rounded-md bg-white/10 p-3">Сотрудники</div>
            <div className="rounded-md bg-white/10 p-3">Поручения</div>
            <div className="rounded-md bg-white/10 p-3">Контроль сроков</div>
          </div>
        </section>
        <section className="flex items-center justify-center p-6 sm:p-10">
          <Card className="w-full border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle>Вход в систему</CardTitle>
              <CardDescription>Для демонстрации используйте любую пару логин/пароль и выберите роль.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form className="grid gap-4" onSubmit={submit}>
                <div className="relative">
                  <UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" required placeholder="Логин" value={form.login} onChange={(event) => setForm({ ...form, login: event.target.value })} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" required type="password" placeholder="Пароль" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
                </div>
                <Select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
                  <option>Администратор</option>
                  <option>Сотрудник</option>
                </Select>
                <Button className="mt-2" type="submit">Войти</Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
