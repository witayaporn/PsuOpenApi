import { access } from "fs";
import NextAuth from "next-auth";
import AuthentikProvider from "next-auth/providers/authentik";

const handler = NextAuth({
  providers: [
    AuthentikProvider({
      clientId: process.env.NEXT_PUBLIC_AUTHENTIK_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_AUTHENTIK_CLIENT_SECRET,
      issuer: process.env.AUTHENTIK_ISSUER,
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  secret: "anythingstring"
});

export { handler as GET, handler as POST }