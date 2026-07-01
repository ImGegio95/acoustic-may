import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email as string;
        const password = credentials.password as string;

        // Admin fallback
        const adminEmail = process.env.ADMIN_EMAIL || "admin@acousticmay.it";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (email === adminEmail && password === adminPassword) {
          return { id: "1", name: "Admin", email: adminEmail, role: "admin" };
        }

        // DB User check
        const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
        const user = userResult[0];

        if (user && bcrypt.compareSync(password, user.password)) {
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
          };
        }
        
        return null;
      }
    })
  ]
});
