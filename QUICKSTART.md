# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

**Option A: Use Docker (Recommended)**

```bash
# Start PostgreSQL with Docker
docker run --name adaptive-map-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=adaptive_map \
  -p 5432:5432 \
  -d postgres:15

# Your DATABASE_URL will be:
# postgresql://postgres:postgres@localhost:5432/adaptive_map?schema=public
```

**Option B: Use Supabase (Cloud)**

1. Go to [supabase.com](https://supabase.com)
2. Create a free project
3. Copy the connection string from Settings → Database
4. Update `.env` file

**Option C: Local PostgreSQL**

```bash
# Install PostgreSQL locally
# Create database
createdb adaptive_map

# Your DATABASE_URL will be:
# postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/adaptive_map?schema=public
```

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your database URL
# The Emergent LLM key is already set
```

### 4. Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed default data (optional but recommended)
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎮 Try It Out

1. **Start Screen**: Enter any topic (e.g., "Machine Learning")
2. **Explore**: Click on nodes to pin them, double-click to expand
3. **Park**: Long-press a node to park it temporarily
4. **Modes**: Switch between Exploration, Curriculum, Classroom, Publishing
5. **Theme**: Click the 🎨 Theme button to customize appearance
6. **Save**: Use the 💾 Saved dropdown to save your session

---

## 🛠️ Development Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run start              # Start production server

# Database
npx prisma studio          # Open database GUI
npx prisma migrate dev     # Create and apply migration
npx prisma db seed         # Seed database
npx prisma generate        # Regenerate Prisma Client

# Code Quality
npm run lint               # Run ESLint
```

---

## 📂 Project Structure

```
/app
├── app/                   # Next.js app directory
│   ├── api/              # API routes
│   │   ├── search/       # Search and expand endpoints
│   │   ├── session/      # Session management
│   │   ├── snapshot/     # Snapshot creation
│   │   ├── fork/         # Fork snapshots
│   │   ├── vote/         # Credibility voting
│   │   └── theme/        # Theme management
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── StartScreen.tsx   # Landing page
│   ├── MapCanvas.tsx     # Main visualization
│   ├── NodeComponent.tsx # Individual nodes
│   ├── ControlPanel.tsx  # Slider controls
│   ├── ModeSelector.tsx  # Mode switcher
│   ├── ParkedTab.tsx     # Parked items
│   ├── SavedGroupsDropdown.tsx
│   └── ThemeCustomizer.tsx
├── lib/                  # Utilities and logic
│   ├── store.ts          # Zustand state management
│   ├── aiRouter.ts       # AI model routing
│   ├── vectorStore.ts    # FAISS-like vector search
│   ├── prisma.ts         # Database client
│   ├── api.ts            # API helpers
│   └── env.ts            # Environment utilities
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
├── .env                  # Environment variables
├── README.md             # Main documentation
└── DEPLOYMENT.md         # Deployment guide
```

---

## 🎯 Key Features to Test

### Exploration Mode
- [ ] Adjust sliders (Common↔Rare, New↔Aged, etc.)
- [ ] Click "Manual Refresh" to regenerate nodes
- [ ] Toggle auto-refresh
- [ ] Pin nodes by clicking
- [ ] Expand nodes by double-clicking

### Node Interactions
- [ ] Hover over nodes (should expand 10-15%)
- [ ] Click to pin a node
- [ ] Long-press to park a node
- [ ] Drag unpinned nodes around

### Parked Items
- [ ] Long-press a node to park it
- [ ] Click hourglass to remove parked item
- [ ] Right-click hourglass for custom timer
- [ ] Watch items expire and fade out

### Theme Customization
- [ ] Try the 3 presets (Minimal Light, Dark Exploration, Dense Research)
- [ ] Adjust node size slider
- [ ] Change colors with color pickers
- [ ] Toggle dark mode
- [ ] Toggle hover effects
- [ ] Toggle pulse animations

### Sessions
- [ ] Create a new session
- [ ] Rename a session
- [ ] Switch between sessions
- [ ] Sessions should auto-save

### Mode Switching
- [ ] Switch to Curriculum Mode (structured hierarchy)
- [ ] Switch to Classroom Mode (quiz system - coming soon)
- [ ] Switch to Publishing Mode (read-only, vote-enabled)

---

## 🔍 Database Inspection

Open Prisma Studio to view and edit database records:

```bash
npx prisma studio
```

This opens a GUI at [http://localhost:5555](http://localhost:5555) where you can:
- View all tables
- Edit records
- Add test data
- Clear data

---

## 🐛 Common Issues

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker ps  # If using Docker

# Test connection
psql postgresql://postgres:postgres@localhost:5432/adaptive_map

# Reset database
npx prisma migrate reset
```

### Prisma Client Not Generated
```bash
# Regenerate
npx prisma generate

# If still failing, delete and reinstall
rm -rf node_modules/.prisma
npm install
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🎨 Customization Ideas

### Add Your Own Theme Preset

Edit `/app/components/ThemeCustomizer.tsx` and add to the `presets` array:

```typescript
{
  name: 'My Custom Theme',
  theme: {
    nodeSize: 50,
    density: 50,
    animationSpeed: 70,
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
      background: '#your-color',
      text: '#your-color',
      accent: '#your-color',
    },
    font: 'Inter',
    lineThickness: 2,
    darkMode: false,
    enableHover: true,
    enablePulse: true,
  },
}
```

### Add New Slider

Edit `/app/components/ControlPanel.tsx` and add to `sliderConfigs`:

```typescript
{
  key: 'mySlider' as const,
  label: 'My Label',
  left: 'Left Side',
  right: 'Right Side'
}
```

Then update the store type in `/app/lib/store.ts`:

```typescript
sliders: {
  commonRare: number;
  newAged: number;
  mainstreamNiche: number;
  popularUnseen: number;
  mySlider: number; // Add this
}
```

---

## 🚀 Next Steps

1. **Enable AI Integration**: Call the Emergent LLM API from search endpoints
2. **Add Authentication**: Implement NextAuth with email magic links
3. **Build Curriculum Mode**: Create taxonomy structures
4. **Build Classroom Mode**: Add quiz system with remediation
5. **Enable Publishing**: Implement snapshot sharing and voting
6. **Add Analytics**: Track usage patterns (aggregate only)
7. **Deploy**: Follow DEPLOYMENT.md to go live

---

**Happy exploring! 🗺️✨**
