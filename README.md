# OrçaZap
Micro SaaS para orçamentos profissionais de prestadores de serviços.
## Stack
Next.js + TypeScript + Prisma + PostgreSQL + Zod.
## Local
Node.js 20+. Copie `.env.example` para `.env.local`, configure DATABASE_URL, rode `npm install`, `npx prisma generate`, `npx prisma db push`, `npm run dev`.
## Rotas
GET `/api/health`
POST `/api/pricing/calculate`
