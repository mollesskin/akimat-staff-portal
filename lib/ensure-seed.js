import { prisma } from "@/lib/prisma";

const departments = [
  "IT",
  "Отдел кадров",
  "Юридический отдел",
  "Финансовый отдел",
  "Отдел архитектуры",
  "Отдел внутренней политики",
  "Канцелярия"
];

const employeeRows = [
  ["Айдана Сейдахметова", "Руководитель аппарата", "Канцелярия", "301"],
  ["Ерлан Мухамеджанов", "Главный специалист", "IT", "214"],
  ["Молдир Ахметова", "HR-менеджер", "Отдел кадров", "205"],
  ["Данияр Омаров", "Юрист", "Юридический отдел", "118"],
  ["Алия Касенова", "Финансовый аналитик", "Финансовый отдел", "406"],
  ["Руслан Ибраев", "Архитектор", "Отдел архитектуры", "322"],
  ["Жанара Нурпеисова", "Специалист по внутренней политике", "Отдел внутренней политики", "217"],
  ["Арман Кожахмет", "Системный администратор", "IT", "212"],
  ["Сауле Берикова", "Делопроизводитель", "Канцелярия", "102"],
  ["Марат Тулегенов", "Главный бухгалтер", "Финансовый отдел", "410"],
  ["Гульмира Сарсенова", "Инспектор кадров", "Отдел кадров", "206"],
  ["Нурлан Абилов", "Юрисконсульт", "Юридический отдел", "121"],
  ["Айгерим Таирова", "Проектный специалист", "Отдел архитектуры", "326"],
  ["Бакытжан Смагулов", "Пресс-секретарь", "Отдел внутренней политики", "220"],
  ["Елена Петрова", "Оператор канцелярии", "Канцелярия", "104"]
];

const taskTitles = [
  "Подготовить отчет по обращениям граждан",
  "Обновить список сотрудников",
  "Проверить договор поставки",
  "Согласовать бюджетную заявку",
  "Подготовить схему благоустройства",
  "Сформировать план мероприятий",
  "Зарегистрировать входящую корреспонденцию",
  "Настроить рабочее место",
  "Подготовить приказ",
  "Проверить платежные документы",
  "Собрать предложения отделов",
  "Обновить контактные данные",
  "Провести правовую экспертизу",
  "Подготовить презентацию для совещания",
  "Проверить сроки исполнения поручений"
];

let seedPromise;

export async function ensureSeed() {
  if (!seedPromise) {
    seedPromise = seedIfEmpty();
  }
  return seedPromise;
}

async function seedIfEmpty() {
  const count = await prisma.employee.count();
  if (count > 0) return;

  const createdEmployees = [];

  for (let index = 0; index < employeeRows.length; index += 1) {
    const [fullName, position, department, office] = employeeRows[index];
    const employee = await prisma.employee.create({
      data: {
        fullName,
        position,
        department: departments.includes(department) ? department : departments[0],
        office,
        phone: `+7 71636 ${String(22000 + index * 137).slice(0, 5)}`,
        email: `employee${String(index + 1).padStart(2, "0")}@akimat-shuchinsk.kz`,
        avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=2563eb,e0f2fe,dbeafe`
      }
    });
    createdEmployees.push(employee);
  }

  const statuses = ["Новая", "В работе", "Выполнена"];
  const priorities = ["Низкий", "Средний", "Высокий"];
  const now = new Date();

  for (let index = 0; index < 30; index += 1) {
    const deadline = new Date(now);
    deadline.setDate(now.getDate() + ((index % 18) - 4));

    await prisma.task.create({
      data: {
        title: taskTitles[index % taskTitles.length],
        description: "Плановое поручение аппарата акима с контролем срока исполнения и ответственным сотрудником.",
        deadline,
        priority: priorities[index % priorities.length],
        status: statuses[index % statuses.length],
        employeeId: createdEmployees[index % createdEmployees.length].id
      }
    });
  }
}
