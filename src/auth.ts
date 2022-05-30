import express from "express";
import { DashboardService } from "./dashboard-service";
import { prisma } from "./prisma";
import { hashSync } from "bcrypt";
import { Router } from "express";

const auth = Router();
//auth.use(express.json());

auth.post("/login", (req, res) => {});

auth.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = hashSync(password, 10);
  const user = await prisma.user.create({
    data: {
      email: email,
      name: name,
      passwordHash: hashedPassword,
    },
  });
});

export { auth };
