import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // PER ORA: Credenziali Admin Semplici
        // In produzione andrebbero su DB con bcrypt
        const adminEmail = process.env.ADMIN_EMAIL || "admin@acousticmay.it";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (credentials?.email === adminEmail && credentials?.password === adminPassword) {
          return { id: "1", name: "Admin", email: adminEmail };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/mio-account", // Usiamo la pagina esistente per il login
  },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Reindirizza al login
      }
      return true;
    },
  },
});
