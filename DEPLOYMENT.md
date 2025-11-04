# Deployment Guide - Adaptive Visual Discovery Map

## 🚀 Vercel Deployment (Recommended)

### Prerequisites
- Vercel account (free tier available)
- PostgreSQL database (Supabase recommended)
- GitHub repository (optional but recommended)

### Step-by-Step Deployment

#### 1. Database Setup (Supabase)

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings** → **Database** → **Connection String**
4. Copy the **Connection Pooling** URL (Prisma format)
5. Your connection string should look like:
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public&pgbouncer=true
   ```

#### 2. Prepare Your Repository

```bash
# If not using Git yet
git init
git add .
git commit -m "Initial commit: Adaptive Visual Discovery Map"

# Push to GitHub
git remote add origin https://github.com/yourusername/adaptive-map.git
git push -u origin main
```

#### 3. Deploy to Vercel

**Option A: Via Vercel Dashboard**

1. Go to [Vercel](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts
```

#### 4. Set Environment Variables in Vercel

Go to your project → **Settings** → **Environment Variables** and add:

**Required:**
```
DATABASE_URL = postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?schema=public
NEXTAUTH_SECRET = [Generate with: openssl rand -base64 32]
NEXTAUTH_URL = https://your-domain.vercel.app
EMERGENT_LLM_KEY = sk-emergent-61f99C1723fA349B33
```

**Optional:**
```
AI_PROVIDER = openai
AI_MODEL = gpt-4o-mini
ENABLE_PAYMENTS = false
ENABLE_ANALYTICS = true
```

**Important:** After adding environment variables, you need to:
1. Go to **Deployments**
2. Click **Redeploy** on the latest deployment
3. Select **Use existing Build Cache** → **No** (to ensure fresh env vars)

#### 5. Run Database Migrations

After deployment, you need to run Prisma migrations:

**Option A: Via Vercel CLI**
```bash
# Install dependencies locally
npm install

# Set DATABASE_URL in your local .env
echo "DATABASE_URL=your-supabase-url" > .env

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

**Option B: Add to Build Command**

In Vercel settings, update **Build Command** to:
```
prisma migrate deploy && npm run build
```

⚠️ **Note:** This will run migrations on every deploy. For production, consider using a separate migration workflow.

#### 6. Verify Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. You should see the start screen
3. Test basic functionality:
   - Enter a topic and click "Explore"
   - Try the mode selector
   - Open theme customizer
   - Check parked tab

---

## 🔧 Alternative Deployment Options

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Set environment variables in Netlify dashboard
```

**netlify.toml** (create this file):
```toml
[build]
  command = "prisma generate && npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Docker (Self-Hosted)

**Dockerfile**:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Build and run**:
```bash
docker build -t adaptive-map .
docker run -p 3000:3000 --env-file .env adaptive-map
```

### Railway

1. Go to [Railway](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select your repository
4. Railway auto-detects Next.js
5. Add environment variables in **Variables** tab
6. Railway automatically provisions PostgreSQL if you add it from **Plugins**

---

## 📊 Post-Deployment

### Monitor Your Application

1. **Vercel Analytics** (built-in):
   - Go to your project → **Analytics**
   - View page views, unique visitors, etc.

2. **Error Monitoring**:
   - Check **Logs** tab in Vercel
   - Consider adding Sentry:
     ```bash
     npm install @sentry/nextjs
     ```

3. **Database Monitoring**:
   - Use Supabase dashboard to monitor queries
   - Check connection pool usage

### Enable Features

To enable feature-flagged monetization:

1. Set in Vercel environment variables:
   ```
   ENABLE_PAYMENTS = true
   ENABLE_CREATOR_ECONOMY = true
   ENABLE_AI_LENS_MARKETPLACE = true
   ```

2. Add Stripe keys:
   ```
   STRIPE_SECRET_KEY = sk_live_...
   STRIPE_PUBLISHABLE_KEY = pk_live_...
   STRIPE_WEBHOOK_SECRET = whsec_...
   ```

3. Redeploy

### Custom Domain

1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable to your custom domain

---

## 🐛 Troubleshooting

### Build Fails

**Error: Cannot find module '@prisma/client'**
```bash
# Solution: Ensure prisma generate runs before build
# Update build command to: prisma generate && next build
```

**Error: Database connection failed**
```bash
# Solution: Check DATABASE_URL format
# Must include ?schema=public for Prisma
# Use connection pooling URL for Supabase
```

### Runtime Errors

**Error: NEXTAUTH_SECRET missing**
```bash
# Generate a secret:
openssl rand -base64 32

# Add to Vercel environment variables
# Redeploy
```

**Error: Cannot connect to database**
```bash
# Check Supabase connection pooling is enabled
# Verify DATABASE_URL includes pgbouncer=true
# Ensure IP whitelist includes 0.0.0.0/0 in Supabase settings
```

### Performance Issues

**Slow initial load**
```bash
# Enable Edge Runtime for API routes (add to route files):
export const runtime = 'edge';

# Use Vercel Edge Functions for better global performance
```

**Database slow queries**
```bash
# Add indexes to Prisma schema:
@@index([userId])
@@index([createdAt])

# Run migration:
npx prisma migrate dev
```

---

## 📈 Scaling

### Database Scaling

1. **Connection Pooling**: Already enabled via Supabase
2. **Read Replicas**: Upgrade to Supabase Pro
3. **Caching**: Add Redis (Upstash) for session caching

### Application Scaling

1. **Edge Functions**: Move API routes to Edge Runtime
2. **CDN**: Vercel automatically uses CDN for static assets
3. **ISR**: Use Incremental Static Regeneration for map snapshots

---

## 🔐 Security Checklist

Before going live:

- [ ] Change NEXTAUTH_SECRET from default
- [ ] Set strong DATABASE_URL password
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up CORS for API routes
- [ ] Enable rate limiting (Vercel Pro feature)
- [ ] Review .env for sensitive data (should not be committed)
- [ ] Set up backup strategy for database
- [ ] Enable Vercel's DDoS protection

---

## 📞 Support

If you encounter issues:

1. Check [Next.js docs](https://nextjs.org/docs)
2. Check [Vercel docs](https://vercel.com/docs)
3. Check [Prisma docs](https://www.prisma.io/docs)
4. Open an issue on GitHub

---

**Your app is now live! 🎉**

Visit your deployment URL and start exploring knowledge maps!
