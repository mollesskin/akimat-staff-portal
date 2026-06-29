# Akimat Staff Portal

Внутренний портал сотрудников КГУ «Аппарат акима города Щучинска Бурабайского района».

## Стек

- Next.js App Router
- React
- JavaScript
- Tailwind CSS
- shadcn/ui-style components
- Lucide React Icons
- PostgreSQL
- Prisma ORM

## Запуск

1. Скопируйте переменные окружения:

```bash
cp .env.example .env
```

2. Укажите PostgreSQL connection string в `.env`.

3. Установите зависимости:

```bash
npm install
```

Если сеть до `registry.npmjs.org` медленная и появляется `EIDLETIMEOUT`, повторите команду. В проект добавлен `.npmrc` с увеличенными timeout/retry-настройками.

4. Создайте миграцию и заполните тестовые данные:

```bash
npx prisma migrate dev
npm run prisma:seed
```

5. Запустите dev-сервер:

```bash
npm run dev
```

Откройте `http://localhost:3000`.

## Демо-вход

Можно использовать любые значения логина и пароля. Роль выбирается на странице входа:

- Администратор
- Сотрудник
