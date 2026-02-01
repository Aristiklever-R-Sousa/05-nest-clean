import { DomainEvents } from '@/core/events/domain-events'
import { config } from 'dotenv'

import { execSync } from 'node:child_process'
import { PrismaClient } from 'prisma/generated/client'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const prisma = new PrismaClient()

const generateUniqueDatabaseURL = (schemaId: string) => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined')
    }

    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set('schema', schemaId)

    return url.toString()
}

const schemaId = `e2e_${Date.now()}`

beforeAll(async () => {
    const databaseURL = generateUniqueDatabaseURL(schemaId)

    process.env.DATABASE_URL = databaseURL

    DomainEvents.shouldRun = false

    execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
    await prisma.$disconnect()
})
