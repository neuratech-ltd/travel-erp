import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getUserById, loginUser } from "./auth.services.js";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return secret;
};

const getTokenExpiresIn = (): string => {
  return process.env.JWT_EXPIRES_IN || "1d";
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    res.status(400).json({
      message: "Email and password are required",
    });
    return;
  }
  const user = await loginUser({
    email,
    password,
  });

  if (!user) {
    res.status(401).json({
      message: "Invalid email or password",
    });
    return;
  }
  const token = jwt.sign({ userId: user.id }, getJwtSecret(), {
    expiresIn: getTokenExpiresIn(),
  } as jwt.SignOptions);

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    user,
  });
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(204).send();
};

export const currentUser = async (req: Request, res: Response) => {
  const user = await getUserById((req as Request & { userId: string }).userId);

  if (!user) {
    res.status(401).json({
      message: "User no longer exists",
    });
    return;
  }

  res.status(200).json({ user });
};
