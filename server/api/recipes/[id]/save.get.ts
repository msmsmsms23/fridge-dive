import { db } from '#server/utils/database';
import { bookmarks } from '~/server/db/schema';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.currentUser;

  const { recipeId } = getQuery(event);

  if (!user || !recipeId) return { saved: false };

  const [existing] = await db.select().from(bookmarks).where(
    and(
      eq(bookmarks.userId, user.id),
      eq(bookmarks.recipeId, Number(recipeId))
    )
  ).limit(1);

  return { saved: !!existing };
});
