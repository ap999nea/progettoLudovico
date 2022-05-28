import express from "express";
import { PrismaClient } from "@prisma/client";
import { DashboardService } from "./dashboard-service";

const prisma = new PrismaClient();

const server = express();

const dashboardService = new DashboardService();

server.use(express.json());

server.post("/:dashboardId/move", async (req, res) => {
  const { position } = req.body;
  const { dashboardId } = req.params;
  // Controlla che la dashboard esista
  // Sposta la dashboard
  const ok = await dashboardService.moveDashboard(dashboardId, position);
  if (!ok) {
    return res.status(401).send({ msg: "Cannot move dashboard" });
  }

  const dashboards = await dashboardService.getDashboards();
  res.status(200).send(dashboards);
});

server.get("/", async (req, res) => {
  const dashboards = await dashboardService.getDashboards();
  res.status(200).send(dashboards);
});

const PORT = 4000;

const serverInstance = server.listen(PORT, () => {
  console.log("🚀 Server is up at http://localhost:4000");
});

process.on("SIGTERM", async () => {
  console.log("Spegnimento...");
  serverInstance.close();
  prisma.$disconnect();
});
