import { defineConfig } from '@prisma/internals'

export default defineConfig({
  datasources: {
    db: {
      url: process.env.POSTGRES_URL,
    },
  },
})
