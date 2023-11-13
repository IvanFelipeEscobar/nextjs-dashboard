import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import type { User } from "./app/lib/definitions";
import bcrypt from 'bcrypt'
import { sql } from "@vercel/postgres";
const getUser = async (email: string) : Promise<User|undefined> => {
try {
    const user = await sql<User>`SELECT * from USERS where email = ${email}`
    return user.rows[0]
} catch (error) {
    console.error('failed to fetch user: ', error)
    throw new Error('failed to fetch user')
}
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

          if(parsedCredentials.success) {
            const {email, password} = parsedCredentials.data
            const user = await getUser(email)
            if(!user)return null
            const verifyPassword = await bcrypt.compare(password, user.password)
            if(verifyPassword)return user
          }
          
          return null
      },
    }),
  ],
});
