import { createClient } from 'redis';

export default {
  getClient() {
    return createClient({ url: process.env.REDIS_DSN })
      .on('error', err => console.log('Redis Client Error', err))
      .connect();
  }
}
