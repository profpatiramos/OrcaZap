const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  const email = "teste@orcazap.com";
  const password = "OrcaZap@123";
  const companyId = "cmstaaoh30000nt60wfy3hm3r";

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.upsert({
    where: {
      email,
    },
    update: {
      passwordHash,
      name: "Usuário Teste",
    },
    create: {
      email,
      name: "Usuário Teste",
      passwordHash,
    },
  });

  await db.companyMember.upsert({
    where: {
      companyId_userId: {
        companyId,
        userId: user.id,
      },
    },
    update: {
      role: "OWNER",
    },
    create: {
      companyId,
      userId: user.id,
      role: "OWNER",
    },
  });

  console.log("");
  console.log("USUÁRIO DE TESTE CRIADO/ATUALIZADO");
  console.log("----------------------------------");
  console.log("E-mail:", email);
  console.log("Senha:", password);
  console.log("ID:", user.id);
  console.log("----------------------------------");
}

main()
  .catch((error) => {
    console.error("ERRO:", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });