import { Dashboard, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DashboardService {
  async moveDashboard(dashboardId: string, position: number): Promise<boolean> {
    const dashboards = await prisma.dashboard.findMany({
      orderBy: {
        position: "asc",
      },
    });

    if (position >= dashboards.length) {
      return false;
    }

    const oldPosition = dashboards.findIndex((i) => i.id === dashboardId);
    if (oldPosition === -1) {
      return false;
    }

    const [dashboard] = dashboards.splice(oldPosition, 1);
    dashboards.splice(position, 0, dashboard);

    await this.reorderDashboards(dashboards);

    return true;
  }

  getDashboards() {
    return prisma.dashboard.findMany({
      orderBy: {
        position: "asc",
      },
      include: {
        contents: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  }

  async reorderDashboards(dashboards: Dashboard[]) {
    //prisma.$transaction(); FA ESEGUIRE A PRISMA TANTE COSE CONTEMPORANEAMENTE
    const updates = dashboards.map((dash, i) => {
      return prisma.dashboard.update({
        where: {
          id: dash.id,
        },
        data: {
          position: i,
        },
      });
    });
    prisma.$transaction(updates);
  }
}
