import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { ZodError, z } from "zod";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const credentialsSchema = z.object({
  phone: z.string(),
  password: z.string(),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
          required: true,
        },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        try {
          // Validate credentials using Zod
          const validatedCredentials = credentialsSchema.parse(credentials);

          // Hash the password before storing it
          const hashedPassword = await bcrypt.hash(
            validatedCredentials.password,
            10
          );
          const existingUser = await db.user.findFirst({
            where: {
              number: validatedCredentials.phone,
            },
          });

          if (existingUser) {
            const passwordValidation = await bcrypt.compare(
              validatedCredentials.password,
              existingUser.password
            );
            if (passwordValidation) {
              return {
                id: existingUser.id.toString(),
                name: existingUser.name,
                email: existingUser.number,
              };
            }
            return null;
          }

          const user = await db.user.create({
            data: {
              number: validatedCredentials.phone,
              password: hashedPassword,
            },
          });
          const balance = await db.balance.create({
            data: {
              userId: user.id,
              amount: 1000,
              locked: 0,
            },
          });

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.number,
          };
        } catch (e) {
          if (e instanceof ZodError) {
            console.error("Validation error:", e.errors);
          } else {
            console.error("Error:", e);
          }
          return null;
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }: any) {
      session.user.id = token.sub;

      return session;
    },
  },
};
