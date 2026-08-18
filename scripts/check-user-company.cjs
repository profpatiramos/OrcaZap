require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  const user = await db.user.findUnique({
    where: {
      email: "teste@orcazap.com",
    },
    include: {
      memberships: {
        include: {
          company: true,
        },
      },
    },
  });

  console.log(JSON.stringify(user, null, 2));
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());