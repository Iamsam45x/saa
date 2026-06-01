# S P Associates — AI Software Solution Configurator

An internal tool for generating business-specific software concepts and UI previews using AI.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (Zinc theme)
- **State Management:** Zustand
- **Database:** Supabase
- **AI:** Anthropic Claude API
- **Linting:** ESLint + Prettier (Airbnb style guide)

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.local` and fill in the required API keys:

- `ANTHROPIC_API_KEY` — Anthropic Claude API key
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase anonymous key

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Protected dashboard
│   ├── builder/            # Project builder
│   ├── templates/          # Template gallery
│   ├── saved/              # Saved projects
│   ├── settings/           # Settings
│   ├── export/             # Export options
│   └── api/                # API routes
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Layout components
│   ├── builder/            # Builder components
│   ├── preview/            # Preview components
│   └── dashboard/          # Dashboard components
├── lib/                    # Shared utilities
│   ├── ai/                 # AI engine
│   ├── supabase/           # Supabase client
│   └── utils/              # Utility functions
├── hooks/                  # Custom React hooks
├── store/                  # Zustand state stores
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
│   ├── styles/
│   └── images/
└── components-library/     # Component library exports
```

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npm run typecheck` — Run TypeScript type checking
- `npm run format` — Format code with Prettier
