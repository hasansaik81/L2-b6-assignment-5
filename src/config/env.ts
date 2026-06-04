
import dotenv from "dotenv";
import status from "http-status";
import AppError from "../errors/AppError.js";
// import AppError from "../errors/AppError";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;

  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;

  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;

  STRIPE: {
    SECRET_KEY: string;
    PUBLIC_KEY: string;
    WEBHOOK_SECRET: string;
  };
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",

    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",

    "STRIPE_SECRET_KEY",
    "STRIPE_PUBLIC_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ];

  requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        `${variable} is missing in .env file`
      );
    }
  });

  return {
    NODE_ENV: process.env.NODE_ENV!,
    PORT: process.env.PORT || "5000",
    DATABASE_URL: process.env.DATABASE_URL!,

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET!,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,

    ACCESS_TOKEN_EXPIRES_IN:
      process.env.ACCESS_TOKEN_EXPIRES_IN || "7d",

    REFRESH_TOKEN_EXPIRES_IN:
      process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",

    STRIPE: {
      SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
      PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY!,
      WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    },
  };
};

export const envVars = loadEnvVariables();