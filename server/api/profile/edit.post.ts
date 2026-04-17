import { db } from '~/server/utils/database'
import { users } from "~/server/db/users";
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const user = event.currentUser

  const value = await db.query.users.findFirst({
    where: eq(users.id, user.id)
  })

  if (!value) {
    setResponseStatus(event, 404)
    return
  }

  const updateValue = {
    nickname: body.nickname ? body.nickname : value.nickname
  }

  const result = await db.update(users).set(updateValue).where(eq(users.id, user.id)).returning()

  return result
})
