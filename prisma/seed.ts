import { PrismaClient } from "@prisma/client";
import { error } from "console";

const prisma = new PrismaClient();

async function main() {
  await prisma.dashboard.create({
    data: {
      name: "Dashboard 1",
      position: 0,
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
