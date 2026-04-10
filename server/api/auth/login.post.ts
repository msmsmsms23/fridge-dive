import { db } from '~/server/utils/database'
import { users } from "~/server/db/users";
import bcrypt from 'bcrypt'
import { eq, or } from "drizzle-orm";
import crypto from "crypto"
import redis from "~/server/utils/redis"
import { sql } from "drizzle-orm";

type LoginForm = {
  email: string;
  password: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as LoginForm

  const user = await db.query.users.findFirst({
    where: eq(users.email, body.email)
  })

  if (!user) {
    setResponseStatus(event, 404, 'No users')
    return
  }

  const isSamePassword = await bcrypt.compare(body.password, user.password)

  if (!isSamePassword) {
    setResponseStatus(event, 404, 'Passwords do not match. Please try again.')
    return
  } else if (!user?.enabled) {
    setResponseStatus(event, 404, "Your account isn’t verified.")
    return
  }

  const token = crypto.randomBytes(64).toString('hex')

  setCookie(event, 'session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })

  const client = await redis.getClient()

  await client.set(`session__${token}`, user.id)

  //await db.update(users).set({ lastLoginAt: sql`NOW()` }).where(eq(users.email, body.email))

  return user
})
