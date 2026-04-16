import { db } from '#server/utils/database';
import { follows } from '~/server/db/schema';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.currentUser;

  const { followingId } = getQuery(event);

  if (!user || !followingId) return { followed: false };

  const [existing] = await db.select().from(follows).where(
    and(
      eq(follows.followerId, user.id),
      eq(follows.followingId, Number(followingId))
    )
  ).limit(1);

  return { followed: !!existing };
});
