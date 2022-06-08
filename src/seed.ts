import { PrismaClient } from "@prisma/client";
import { error } from "console";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Giulia",
      email: "ap999nea@apnea.com",
      passwordHash: "",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Manuel",
      email: "manuel@example.com",
      passwordHash: "",
    },
  });
  await prisma.dashboard.create({
    data: {
      name: "Dashboard 1",
      position: 0,
      userId: user2.id,
      contents: {
        create: [
          {
            text: "Ciao a tutti",
            position: 0,
          },
          {
            text: "Qualcosa da fare",
            position: 1,
          },
        ],
      },
    },
  });

  await prisma.dashboard.create({
    data: {
      name: "Dashboard 2",
      position: 1,
      userId: user.id,
      contents: {
        create: [
          {
            text: "Ciao Lacerba",
            position: 0,
          },
          {
            text: "I miei task",
            position: 1,
          },
        ],
      },
    },
  });

  await prisma.dashboard.create({
    data: {
      name: "Conquistare il mondo",
      position: 2,
      userId: user.id,
      contents: {
        create: [
          {
            text: "Valutare i miei colleghi",
            position: 0,
          },
          {
            text: "Superare i miei colleghi",
            position: 1,
          },
        ],
      },
    },
  });
}

main()
  .then(() => {
    console.log("Ok!");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(0);
  });
