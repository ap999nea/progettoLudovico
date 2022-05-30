import express from "express";
import { PrismaClient } from "@prisma/client";
import { DashboardService } from "./dashboard-service";
import { prisma } from "./prisma";

const dashboardService = new DashboardService();

const app = express();

const getUser = async () => {
  const user = await prisma.user.findFirst({
    where: {
      email: "ap999nea@apnea.com",
    },
  });
  return user!;
};

app.post("/", async (req, res) => {
  const { name } = req.body;
  const user = await getUser();
  await dashboardService.createDashboard(user.id, name);
  const dashboards = await dashboardService.getDashboards(user.id);
  res.status(200).send(dashboards);
});

app.post("/:dashboardId/move", async (req, res) => {
  const { position } = req.body;
  const { dashboardId } = req.params;
  const user = await getUser();
  // Controlla che la dashboard esista
  // Sposta la dashboard
  const ok = await dashboardService.moveDashboard(
    user.id,
    dashboardId,
    position
  );
  if (!ok) {
    return res.status(401).send({ msg: "Cannot move dashboard" });
  }

  const dashboards = await dashboardService.getDashboards(user.id);
  res.status(200).send(dashboards);
});

app.post("/:dashboardId", async (req, res) => {
  const { dashboardId } = req.params;
  const { text } = req.body;
  const user = await getUser();
  await dashboardService.createContent(user.id, dashboardId, text);
  const dashboards = await dashboardService.getDashboards(user.id);
  res.status(200).send(dashboards);
});

app.delete("/:dashboardId", async (req, res) => {
  const { dashboardId } = req.params;
  const user = await getUser();
  const dashboard = await dashboardService.deleteDashboard(
    user.id,
    dashboardId
  );
  if (!dashboard) {
    return res.status(401).send({ msg: "Cannot delete dashboard" });
  }
  const dashboards = await dashboardService.getDashboards(user.id);
  res.status(200).send(dashboards);
});

app.delete("/:dashboardId/:contentId", async (req, res) => {
  const { dashboardId, contentId } = req.params;
  const user = await getUser();
  const content = await dashboardService.deleteContent(
    user.id,
    dashboardId,
    contentId
  );
  if (!content) {
    return res.status(401).send({ msg: "Cannot delete content" });
  }
  const dashboards = await dashboardService.getDashboards(user.id);
  res.status(200).send(dashboards);
});

app.post("/:dashboardId/:contentId/move", async (req, res) => {
  const to = req.body;
  const { dashboardId, contentId } = req.params;
  const user = await getUser();
  // Controlla che la dashboard esista
  // Sposta la dashboard
  const ok = await dashboardService.moveContent(
    user.id,
    contentId,
    to.position,
    dashboardId,
    to.dashboardId
  );
  if (!ok) {
    return res.status(401).send({ msg: "Cannot move content" });
  }

  const dashboards = await dashboardService.getDashboards(user.id);
  res.status(200).send(dashboards);
});

app.get("/", async (req, res) => {
  const user = await getUser();
  const dashboards = await dashboardService.getDashboards(user.id);
  res.status(200).send(dashboards);
});

export { app };
