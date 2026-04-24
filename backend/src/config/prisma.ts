import { PrismaClient } from "@prisma/client";

import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL
});

console.log(adapter)

export const prisma:PrismaClient= new PrismaClient({adapter});



// import "dotenv/config";
// import pg from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "@prisma/client";

// const { Pool } = pg;

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL is not set");
// }

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// const adapter = new PrismaPg(pool);

// export const prisma = new PrismaClient({
//   adapter,
// });