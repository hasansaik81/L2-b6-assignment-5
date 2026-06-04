
// import dotenv from "dotenv";

// dotenv.config();

// const config = {
//   NODE_ENV: process.env.NODE_ENV || "development",
//   PORT: process.env.PORT || "5000",
//   DATABASE_URL: process.env.DATABASE_URL || "",

//   STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
//   STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY || "",
//   STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
// };

// export default config;



import dotenv from "dotenv";

dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000, 
  DATABASE_URL: process.env.DATABASE_URL || "",

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
};

export default config;
