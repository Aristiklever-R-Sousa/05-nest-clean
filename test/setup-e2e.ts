import { DomainEvents } from '@/core/events/domain-events'
import { envSchema } from '@/infra/env/env'
import { config } from 'dotenv'
import Redis from 'ioredis'

import { execSync } from 'node:child_process'
import { PrismaClient } from 'prisma/generated/client'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    db: env.REDIS_DB,
})

const prisma = new PrismaClient()

const generateUniqueDatabaseURL = (schemaId: string) => {
    if (!env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined')
    }

    const url = new URL(env.DATABASE_URL)

    url.searchParams.set('schema', schemaId)

    return url.toString()
}

const schemaId = `e2e_${Date.now()}`

beforeAll(async () => {
    const databaseURL = generateUniqueDatabaseURL(schemaId)

    env.DATABASE_URL = databaseURL

    DomainEvents.shouldRun = false

    await redis.flushdb()

    execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
    await prisma.$disconnect()
})
