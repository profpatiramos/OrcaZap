import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const company = await db.company.create({
    data: {
      name: "OrcaZap",
      tradeName: "OrcaZap",
      responsibleName: "Administrador",
    },
  });

  console.log("Empresa criada:", company.id);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });