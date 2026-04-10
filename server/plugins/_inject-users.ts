import redis from "~/server/utils/redis";
import { db } from "~/server/utils/database";
import { eq } from "drizzle-orm";
import { users } from "~/server/db/users";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("request", async (event) => {
    let token = getCookie(event, 'session');

    if (!token) {
      console.log("no token")
      return
    }

    const client = await redis.getClient()

    const session = await client.get(`session__${token}`)

    if (!session) {
      return
    }

    event.currentUser = await db.query.users.findFirst({
      where: eq(users.id, session)
    })
  });
});
