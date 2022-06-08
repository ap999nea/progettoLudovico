import express from "express";
import { app } from "./app";
import { prisma } from "./prisma";
//import { auth } from "./auth";
//const path = require("path");
import cors from "cors";

//const prisma = new PrismaClient();

const server = express();

server.use("/", express.static(__dirname + "/"));
server.use(express.json());
server.use(cors());
server.use("/app", app);
//server.use("/auth", auth);

const PORT = 8000;

const serverInstance = server.listen(PORT, () => {
  console.log("🚀 Server is up at http://localhost:" + PORT);
});

process.on("SIGTERM", async () => {
  console.log("Spegnimento...");
  serverInstance.close();
  prisma.$disconnect();
});

export default server;

//cjboisuoubcip
