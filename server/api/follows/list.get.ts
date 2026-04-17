import { db } from '#server/utils/database';
import { users } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const user = event.currentUser;

  if (!user) throw createError({ statusCode: 401, statusMessage: "로그인이 필요합니다." });

  const followers = await db.query.users.findMany({
    where: eq(users.id, user.id),
    with: {
      followers: true,
    }
  });

  const followings = await db.query.users.findMany({
    where: eq(users.id, user.id),
    with: {
      following: true
    }
  });

  const followingIds = followings[0]?.following.map(f => f.followingId) || [];

  const followerIds = followers[0]?.followers.map(f => f.followerId) || [];

  const mutualFriendIds = followingIds.filter(id => followerIds.includes(id));

  if (mutualFriendIds.length === 0) return [];

  const friends = await db.query.users.findMany({
    where: (users, { inArray }) => inArray(users.id, mutualFriendIds),
    with: {
      recipes: {
        limit: 1,
        orderBy: (recipes, { desc }) => [desc(recipes.createdAt)]
      }
    }
  });

  return friends.map(friend => ({
    id: friend.id,
    nickname: friend.nickname,
    lastRecipe: friend.recipes[0]?.title || null
  }));
});
