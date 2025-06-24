import { hash } from "@node-rs/argon2";
import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

const mockUsers = [
  {
    email: "sosler@rrc.ca",
    userName: "moose",
    password: "pass",
    emailVerified: true,
  },
  {
    email: "jane.smith@example.com",
    userName: "janesmith",
    password: "password123",
    emailVerified: true,
  },
  {
    email: "mike.johnson@example.com",
    userName: "mikejohnson",
    password: "password123",
    emailVerified: false,
  },
  {
    email: "sarah.wilson@example.com",
    userName: "sarahwilson",
    password: "password123",
    emailVerified: true,
  },
  {
    email: "alex.brown@example.com",
    userName: "alexbrown",
    password: "password123",
    emailVerified: false,
  },
  {
    email: "emily.davis@example.com",
    userName: "emilydavis",
    password: "password123",
    emailVerified: true,
  },
  {
    email: "david.miller@example.com",
    userName: "davidmiller",
    password: "password123",
    emailVerified: true,
  },
  {
    email: "lisa.garcia@example.com",
    userName: "lisagarcia",
    password: "password123",
    emailVerified: false,
  },
];

async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}

async function seedUsers() {
  console.log("Starting database seeding...");

  try {
    console.log("Cleaning existing data...");
    await prisma.userKey.deleteMany();
    await prisma.user.deleteMany();

    console.log("Creating users with hashed passwords...");

    for (const userData of mockUsers) {
      const { password, ...userFields } = userData;
      const hashedPassword = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
          ...userFields,
          userKey: {
            create: {
              hashedPassword,
            },
          },
        },
        include: {
          userKey: true,
        },
      });

      console.log(`Created user: ${user.userName} (${user.email})`);
    }

    console.log(`Successfully seeded ${mockUsers.length} users!`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

async function main() {
  try {
    await seedUsers();
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
