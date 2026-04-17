import { db } from '~/server/utils/database'
import { users } from "~/server/db/users";
import bcrypt from "bcrypt";
import { eq } from 'drizzle-orm';

type PasswordForm = {
  password: string;
  password2: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as PasswordForm

  const user = event.currentUser

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "로그인이 필요합니다." });
  }

  if (!body.password || !body.password2) {
    throw createError({
      statusCode: 400,
      statusMessage: "PASSWORD_REQUIRED",
      message: "모든 필드를 입력해 주세요."
    });
  }

  if (body.password !== body.password2) {
    throw createError({
      statusCode: 400,
      statusMessage: "PASSWORD_MISMATCH",
      message: "비밀번호가 일치하지 않습니다."
    });
  }

  const value = await db.query.users.findFirst({
    where: eq(users.id, user.id)
  })

  if (!value) {
    throw createError({ statusCode: 404, statusMessage: "유저를 찾을 수 없습니다." });
  }

  const isSamePassword = await bcrypt.compare(body.password, value.password)

  if (isSamePassword) {
    throw createError({
      statusCode: 400,
      statusMessage: "SAME_AS_OLD",
      message: "이전 비밀번호와 동일한 비밀번호는 사용할 수 없습니다."
    });
  }

  const updateValue = {
    password: body.password ? await bcrypt.hash(body.password, 14) : value.password
  }

  const result = await db.update(users).set(updateValue).where(eq(users.id, user.id)).returning()

  return result
})
