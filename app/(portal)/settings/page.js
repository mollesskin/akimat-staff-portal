"use client";

import { Database, Moon, Server, ShieldCheck, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/layout/theme-provider";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    toast(next === "dark" ? "Темная тема включена" : "Светлая тема включена", "info");
  };

  return (
    <div className="page-shell">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-normal">Настройки</h1>
        <p className="text-sm text-muted-foreground">Параметры интерфейса и информация о системе.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Тема интерфейса</CardTitle>
            <CardDescription>Переключение сохраняется в браузере пользователя.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Включить светлую тему" : "Включить темную тему"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Информация о системе</CardTitle>
            <CardDescription>Akimat Staff Portal для ежедневной работы сотрудников.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <SystemRow icon={Server} label="Frontend" value="Next.js App Router, React, JavaScript, Tailwind CSS" />
            <SystemRow icon={Database} label="Backend и БД" value="Next.js Route Handlers, PostgreSQL, Prisma ORM" />
            <SystemRow icon={ShieldCheck} label="Роли" value="Администратор, Сотрудник" />
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">CRUD</Badge>
              <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">Пагинация</Badge>
              <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">Toast</Badge>
              <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">Адаптивность</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SystemRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-md border p-3">
      <Icon className="mt-0.5 h-4 w-4 text-primary" />
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-sm text-muted-foreground">{value}</div>
      </div>
    </div>
  );
}
