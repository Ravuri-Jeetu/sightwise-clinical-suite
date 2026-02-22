import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // Find user by email
                const user = await prisma.user.findUnique({
                    where: { email: (credentials.email as string).toLowerCase().trim() },
                });

                console.log("Auth attempt for:", credentials.email, "User found:", !!user);

                // @ts-ignore
                if (!user || user.password !== credentials.password) {
                    console.log("Auth failed: Invalid credentials");
                    return null;
                }

                console.log("Auth success for:", user.email);

                return {
                    id: user.id,
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            if (trigger === "update" && session?.role) {
                token.role = session.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    session: { strategy: "jwt" },
    trustHost: true,
});
