import { db } from '#server/utils/database';
import { follows } from '#server/db/schema';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.currentUser;

  if (!user) throw createError({ statusCode: 401, statusMessage: "로그인이 필요합니다." });

  const { followingId } = await readBody(event);
  if (!followingId) throw createError({ statusCode: 400, statusMessage: "팔로우 대상이 없습니다." });

  if (user.id === followingId) {
    throw createError({ statusCode: 400, statusMessage: "자기 자신은 팔로우할 수 없습니다." });
  }

  const [existing] = await db.select().from(follows).where(
    and(
      eq(follows.followerId, user.id),
      eq(follows.followingId, followingId)
    )
  ).limit(1);

  if (existing) {
    await db.delete(follows).where(eq(follows.id, existing.id));
    return { followed: false, message: 'unfollowed' };
  } else {
    await db.insert(follows).values({
      followerId: user.id,
      followingId: followingId
    });
    return { followed: true, message: 'followed' };
  }
});
