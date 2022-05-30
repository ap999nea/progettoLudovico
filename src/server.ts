import express from "express";
//import { PrismaClient } from "@prisma/client";
//import { DashboardService } from "./dashboard-service";
import { app } from "./app";
import { prisma } from "./prisma";
import { auth } from "./auth";
const path = require("path");

//const prisma = new PrismaClient();

const server = express();

//const dashboardService = new DashboardService();

server.use(express.json());
server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});
server.use("/app", app);
server.use("/auth", auth);
//server.use(cors());

const PORT = 4000;

const serverInstance = server.listen(PORT, () => {
  console.log("🚀 Server is up at http://localhost:4000");
});

process.on("SIGTERM", async () => {
  console.log("Spegnimento...");
  serverInstance.close();
  prisma.$disconnect();
});
