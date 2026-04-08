import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      passwordHash: 'dummy-hash',
      displayName: 'Demo User',
    },
  });

  const rakuten = await prisma.company.upsert({
    where: {
      id: '11111111-1111-1111-1111-111111111111',
    },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111111',
      userId: user.id,
      name: 'Rakuten',
      websiteUrl: 'https://corp.rakuten.com',
      country: 'Japan',
      notes: 'Large Japanese tech company',
    },
  });

  const smarthr = await prisma.company.upsert({
    where: {
      id: '22222222-2222-2222-2222-222222222222',
    },
    update: {},
    create: {
      id: '22222222-2222-2222-2222-222222222222',
      userId: user.id,
      name: 'SmartHR',
      websiteUrl: 'https://smarthr.co.jp',
      country: 'Japan',
      notes: 'Japanese SaaS company',
    },
  });

  await prisma.jobApplication.createMany({
    data: [
      {
        userId: user.id,
        companyId: rakuten.id,
        positionTitle: 'Backend Engineer',
        status: 'interview',
        appliedAt: new Date('2026-03-20'),
        source: 'LinkedIn',
        location: 'Tokyo',
        salaryMin: 6000000,
        salaryMax: 9000000,
        jobPostUrl: 'https://example.com/rakuten/backend',
        notes: 'First interview scheduled',
      },
      {
        userId: user.id,
        companyId: smarthr.id,
        positionTitle: 'Full Stack Engineer',
        status: 'applied',
        appliedAt: new Date('2026-03-25'),
        source: 'Direct',
        location: 'Tokyo',
        salaryMin: 5500000,
        salaryMax: 8000000,
        jobPostUrl: 'https://example.com/smarthr/fullstack',
        notes: 'Waiting for response',
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
