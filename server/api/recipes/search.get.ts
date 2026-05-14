import { db } from '#server/utils/database';
import { recipes } from '../../db/schema';
import { sql, desc, eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { keyword, type } = getQuery(event);
  const user = event.currentUser;

  if (!keyword || typeof keyword !== 'string' || !keyword.trim()) {
    return { data: [] };
  }

  try {
    const words = keyword.trim().split(/\s+/);
    const searchTerm = words.join(' & ') + ':*';

    const searchFilter = sql`fts @@ to_tsquery('simple', ${searchTerm})`;

    let whereClause;
    if (type === 'mine' && user) {
      whereClause = and(searchFilter, eq(recipes.userId, user.id));
    } else {
      whereClause = and(searchFilter, eq(recipes.isPublic, 'public'));
    }

    const result = await db.query.recipes.findMany({
      where: whereClause,
      with: {
        user: true,
        cookingLogs: true
      },
      orderBy: [desc(recipes.createdAt)]
    });

    return { data: result };
  } catch (error: any) {
    console.error('Search API Error:', error.message);
  }
});
