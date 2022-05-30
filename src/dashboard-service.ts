import { Content, Dashboard, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DashboardService {
  async moveDashboard(
    userId: string,
    dashboardId: string,
    position: number
  ): Promise<boolean> {
    const dashboards = await prisma.dashboard.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        position: "asc",
      },
    });

    if (position > dashboards.length) {
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

  async createContent(userId: string, dashboardId: string, text: string) {
    const dashboard = await this.getDashboard(userId, dashboardId);
    if (!dashboard) {
      return null;
    }
    const countContent = await prisma.content.count({
      where: {
        dashboardId: dashboardId,
      },
    });
    return await prisma.content.create({
      data: {
        position: countContent,
        text: text,
        dashboardId: dashboardId,
      },
    });
  }

  async createDashboard(userId: string, name: string) {
    const countDashboard = await prisma.dashboard.count();
    return await prisma.dashboard.create({
      data: {
        position: countDashboard,
        name: name,
        userId: userId,
      },
    });
  }

  async deleteDashboard(userId: string, dashboardId: string) {
    const dashboard = await this.getDashboard(userId, dashboardId);
    if (!dashboard) {
      return null;
    }
    const contentsInDashboard = await prisma.content.count({
      where: {
        dashboardId: dashboardId,
      },
    });
    if (contentsInDashboard > 0) {
      return null;
    }
    return await prisma.dashboard.delete({
      where: {
        id: dashboardId,
      },
    });
  }

  async deleteContent(userId: string, dashboardId: string, contentId: string) {
    const dashboard = await this.getDashboard(userId, dashboardId);
    if (!dashboard) {
      return null;
    }
    const deleted = await prisma.content.delete({
      where: {
        id: contentId,
        id_dashboardId: {
          dashboardId: dashboardId,
          id: contentId,
        },
      },
    });

    const allContents = await prisma.content.findMany({
      where: {
        dashboardId: dashboardId,
      },
    });

    await this.reorderContent(allContents, dashboardId);

    return deleted;
  }

  async moveContent(
    userId: string,
    contentId: string,
    position: number,
    fromDashboardId: string,
    toDashboardId: string
  ): Promise<boolean> {
    const fromToSameDashboard = fromDashboardId === toDashboardId;
    const fromDashboard = await this.getDashboard(userId, fromDashboardId);
    if (!fromDashboard) {
      return false;
    }

    if (!fromToSameDashboard) {
      const toDashboard = await this.getDashboard(userId, toDashboardId);
      if (!toDashboard) {
        return false;
      }
    }

    const fromContents = await prisma.content.findMany({
      orderBy: {
        position: "asc",
      },
      where: {
        dashboardId: fromDashboardId,
      },
    });

    const toContents = fromToSameDashboard
      ? fromContents
      : await prisma.content.findMany({
          orderBy: {
            position: "asc",
          },
          where: {
            dashboardId: toDashboardId,
          },
        });

    if (position > toContents.length) {
      return false;
    }

    const oldPosition = fromContents.findIndex((i) => i.id === contentId);
    if (oldPosition === -1) {
      return false;
    }

    const [content] = fromContents.splice(oldPosition, 1);
    if (oldPosition < position) {
      position = position - 1;
    }
    toContents.splice(position, 0, content);

    await this.reorderContent(fromContents, fromDashboardId);

    if (!fromToSameDashboard) {
      await this.reorderContent(toContents, toDashboardId);
    }

    return true;
  }

  getDashboards(userId: string) {
    console.log(userId);
    return prisma.dashboard.findMany({
      where: {
        userId: userId,
      },
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

  private async reorderDashboards(dashboards: Dashboard[]) {
    //prisma.$transaction(); FA ESEGUIRE A PRISMA TANTE COSE CONTEMPORANEAMENTE
    const updates = dashboards.map((dash, position) => {
      return prisma.dashboard.update({
        where: {
          id: dash.id,
        },
        data: {
          position: position,
        },
      });
    });
    prisma.$transaction(updates);
  }

  private async reorderContent(contents: Content[], dashboardId: string) {
    //prisma.$transaction(); FA ESEGUIRE A PRISMA TANTE COSE CONTEMPORANEAMENTE
    const updates = contents.map((content, position) => {
      return prisma.content.update({
        where: {
          id: content.id,
        },
        data: {
          position: position,
          dashboardId: dashboardId,
        },
      });
    });
    prisma.$transaction(updates);
  }

  getDashboard(userId: string, dashboardId: string) {
    return prisma.dashboard.findUnique({
      where: {
        id_userId: {
          id: userId,
          userId: dashboardId,
        },
      },
    });
  }
}
