export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'session');

  if (!token) {
    return { message: "이미 로그아웃 상태입니다." };
  }

  deleteCookie(event, 'session', {
    path: '/'
  });

  const client = await redis.getClient();

  const sessionKey = `session__${token}`;
  const session = await client.get(sessionKey);

  if (session) {
    await client.del(sessionKey);
  }

  return { success: true, message: "로그아웃 성공" };
});
