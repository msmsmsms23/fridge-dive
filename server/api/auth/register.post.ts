import { db } from '~/server/utils/database'
import { users } from "~/server/db/users";
import bcrypt from "bcrypt"

type RegisterForm = {
  email: string;
  nickname: string;
  password: string;
  password2: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as RegisterForm

  const currentNicknames = await db.query.users.findMany({
    columns: {
      nickname: true
    },
  });

  if (currentNicknames.some(curNickname => curNickname.nickname === body.nickname)) {
    throw createError({ statusCode: 409, statusMessage: "이미 사용 중인 닉네임입니다." });
  }

  if (body.password !== body.password2) {
    setResponseStatus(event, 400, 'Passwords do not match. Please try again.')
    return
  }

  const user = {
    email: body.email,
    nickname: body.nickname,
    password: await bcrypt.hash(body.password, 14),
    enabled: true,
  }

  const result = await db.insert(users).values(user).returning()

  return result
})
