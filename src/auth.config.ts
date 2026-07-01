import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [], // I veri provider andranno in auth.ts
  pages: {
    signIn: "/mio-account",
  },
  trustHost: true,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      if (isOnAdmin) {
        if (isLoggedIn && (auth.user as any).role === "admin") return true;
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
