import { PrismaClient } from '@prisma/client'

// Reuse one client across hot reloads in development so connections are not exhausted.
const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
