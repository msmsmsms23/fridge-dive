export default defineAppConfig({
  ui: {
    primary: 'customPrimary',
    gray: 'customGray',
  },

  privateRuntimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databasePort: process.env.DATABASE_PORT,
    databaseUser: process.env.DATABASE_USER,
    databasePassword: process.env.DATABASE_PASSWORD,
    databaseName: process.env.DATABASE_NAME,
    redisDsn: process.env.REDIS_DSN,
  },
})
