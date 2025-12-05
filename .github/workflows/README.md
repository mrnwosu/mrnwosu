# GitHub Actions: Prisma Deploy

This workflow automatically deploys database migrations when the Prisma schema changes.

## Setup

Add one repository secret:

**Settings → Secrets and variables → Actions → New repository secret**

```
Name: POSTGRES_URL
Value: postgresql://postgres:PASSWORD@your-host:5432/mrnwosu
```

## How It Works

When you push schema changes to `main`:

```
Push to main branch
    ↓
Prisma schema or migrations changed?
    ↓ Yes
Workflow triggers
    ↓
npx prisma migrate deploy
    ↓
Database updated ✅
```

## Workflow Details

**File:** `prisma-deploy.yml`

**Triggers:**
- Push to `main` branch with changes to `prisma/`
- Manual trigger (Actions tab → Run workflow)

**Steps:**
1. Checkout code
2. Setup Node.js 22
3. Install dependencies
4. Generate Prisma Client
5. Deploy migrations with `prisma migrate deploy`

## Before Pushing

Always test locally:

```bash
npx prisma migrate dev --name your_migration_name
npx prisma migrate status
npx prisma validate
```

## Troubleshooting

**Migration fails in GitHub Actions:**
- Verify `POSTGRES_URL` secret is correct
- Check database is accessible from GitHub
- Run `npx prisma validate` locally
- Review migration SQL: `cat prisma/migrations/*/migration.sql`

**Database connection timeout:**
- Whitelist GitHub Actions IP in firewall
- Verify database credentials and host

## Documentation

- [Prisma Migrate Deploy](https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate)
- [GitHub Actions](https://docs.github.com/en/actions)

