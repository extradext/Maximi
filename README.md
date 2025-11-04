# Adaptive Visual Discovery Map

> AI-powered dynamic branching search and visual learning platform

## 🚀 Features

### Operating Modes

1. **Exploration Mode** - AI-generated clusters with dynamic sliders
   - 4 sliders: Common↔Rare, New↔Aged, Mainstream↔Niche, Popular↔Unseen
   - Auto/manual refresh with customizable intervals
   - Pin-in-place nodes with hover-expand
   - Connection pulse animation (togglable)

2. **Curriculum Mode** - Structured hierarchical learning
   - Kingdom → Phylum → Class → Order progression
   - Locked progression paths
   - AI suggestions disabled

3. **Classroom Mode** - Interactive quiz system
   - Hard-coded quizzes with remediation paths
   - Wrong answers open simpler sub-questions
   - Original question reappears after remediation
   - Correct answers turn green and remediation branch disappears

4. **Publishing Mode** - Share and collaborate
   - Freeze maps as read-only snapshots
   - Fork snapshots to create new sessions
   - Thumb-up/thumb-down credibility indicators
   - Node borders color-coded (green ↔ red) based on votes

### Core Features

- **Pin-in-Place Nodes**: Hover expands 10-15%, click locks expansion
- **Parked Tab**: Global hourglass timer (click reset, long-press custom duration)
- **Saved Sessions**: Renameable with expiry timers (keep forever/auto-delete/archive)
- **Share & Fork**: Copy hash links, fork snapshots with pinned nodes only
- **Theme Customizer**: No-code sliders for:
  - Node size, density, animation speed
  - Color pickers for all theme colors
  - Font selection, line thickness
  - Dark mode toggle
  - Hover/pulse animation toggles
  - 3 presets: Minimal Light, Dark Exploration, Dense Research

### Technical Features

- **< 300ms animations** with reduced-motion support
- **Keyboard navigation** and screen-reader accessible
- **Mobile responsive** (manual refresh default on mobile)
- **Vector search** with local FAISS implementation
- **AI integration** via Emergent LLM key (OpenAI, Anthropic, Google)
- **Performance optimized** (< 800ms load target)

## 📦 Tech Stack

- **Frontend**: Next.js 14+ (React 18) + TypeScript + Tailwind CSS + Framer Motion
- **State**: Zustand with persistence
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **AI**: Emergent LLM integration (universal key)
- **Vector Search**: FAISS (local)
- **Auth**: NextAuth (email magic links)
- **Deployment**: Vercel-ready

## 🛠️ Setup

### Prerequisites

- Node.js 18+
- PostgreSQL (local or Supabase)
- npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update DATABASE_URL in .env with your PostgreSQL connection string
# For Supabase:
# DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/postgres?schema=public"

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed default theme presets (optional)
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

### Required

```env
DATABASE_URL="postgresql://..."          # PostgreSQL connection
NEXTAUTH_SECRET="your-secret"            # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"     # Your app URL
EMERGENT_LLM_KEY="sk-emergent-..."       # Emergent universal key (provided)
```

### Optional

```env
# Custom AI Provider (overrides Emergent LLM)
AI_PROVIDER_KEY=""                       # Your OpenAI/Anthropic/Google key
AI_PROVIDER="openai"                     # openai | anthropic | gemini
AI_MODEL="gpt-4o-mini"                   # Model name

# Feature Flags (Monetization - Coming Soon)
ENABLE_PAYMENTS=false                    # Stripe integration
ENABLE_CREATOR_ECONOMY=false             # Creator revenue share
ENABLE_AI_LENS_MARKETPLACE=false         # Multiple AI model tiers

# Email (for magic links)
EMAIL_SERVER="smtp://..."                # SMTP server
EMAIL_FROM="noreply@example.com"         # From address

# Analytics
ENABLE_ANALYTICS=true                    # Aggregate usage tracking
```

## 💰 Monetization (Feature-Flagged)

**Status**: Scaffolded but disabled. Enable with `ENABLE_PAYMENTS=true`

### Tiers

| Tier | Features | Status |
|------|----------|--------|
| **Free** | Exploration mode + limited sessions + default AI | ✅ Live |
| **Pro** | Curriculum/Classroom + unlimited pins + theme editor + Pro models | 🔜 Coming Soon |
| **Creator** | Publishing + revenue share (10-15% cut) | 🔜 Coming Soon |

### AI Lens Marketplace

| Lens | Purpose | Model | Price | Status |
|------|---------|-------|-------|--------|
| Explorer | General | gpt-4o-mini | Free | ✅ Active |
| Scholar | Academic | claude-3-7-sonnet | +$5 | 🔜 Placeholder |
| Creator | Multimodal | gpt-4o | Credits | 🔜 Placeholder |
| Tutor | Pedagogy | claude-4-sonnet | Pro | 🔜 Placeholder |
| Enterprise | Private | Self-hosted | Contract | 🔜 Placeholder |

### Implementation

All payment code exists but is wrapped in feature flags:

```typescript
if (process.env.ENABLE_PAYMENTS === 'true') {
  // Stripe integration
  // Subscription management
  // Creator economy
}
```

UI shows "Coming Soon" labels for unavailable features.

## 🗄️ Database Schema

### Core Tables

- `users` - User accounts
- `session_states` - Saved map sessions
- `pins` - Pinned nodes
- `parked_items` - Temporary parked nodes with timers
- `theme_presets` - Custom themes
- `votes` - Credibility votes (publishing mode)
- `analytics` - Aggregate usage data

### Dormant Tables (Feature-Flagged)

- `plans` - Subscription tiers
- `subscriptions` - User subscriptions
- `payments` - Payment history
- `ai_model_lenses` - AI marketplace configuration

## 📱 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Make sure to set DATABASE_URL to production Postgres (e.g., Supabase)
```

### Environment Setup

1. **Database**: Use Supabase or any PostgreSQL provider
2. **Environment Variables**: Set all required vars in Vercel dashboard
3. **Prisma**: Vercel automatically runs `prisma generate` during build

## 🧪 Testing

Unit tests for:
- Timers and expiration logic
- State reducers and mutations
- Vote calculation and credibility colors
- Serialization and deserialization

E2E tests for:
- Full cycle: seed → pin → park → expire → save → share → fork
- Mode switching and feature availability
- Theme customization and persistence

```bash
# Run tests (coming soon)
npm test
```

## 🎨 Theme Presets

### 1. Minimal Light
- Clean, spacious layout
- Subtle animations
- High contrast for readability

### 2. Dark Exploration
- Dark theme with vibrant accents
- Medium density
- Pulsing connections enabled

### 3. Dense Research
- Maximum information density
- Faster animations
- Thicker connection lines

## 🔐 Security

- CSRF protection on all mutations
- Input validation and sanitization
- Sessions private by default
- Hash-based unlisted share links
- No personal data in analytics

## 📊 Performance

- Initial load: < 800ms (mid-range Android target)
- Animations: < 300ms
- Debounced slider updates
- Virtualized lists for large datasets
- Lazy image loading
- Worker-threaded embedding generation

## 🤝 Contributing

Contributions welcome! This is an open platform for knowledge discovery.

## 📄 License

MIT License - see LICENSE file

## 🆘 Support

For issues or questions:
- GitHub Issues
- Email: support@example.com

---

**Built with ❤️ for explorers, learners, and creators**