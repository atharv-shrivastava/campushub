# CampusHub — immersive UI lab

This branch is a separate visual/product-design track for CampusHub:

`design/cube-immersive-ui`

It leaves `main` untouched while exploring a more expressive mobile-first experience.

## Visual system

Five complete theme options are included:

1. Emerald & Champagne
2. Lavender & Apricot
3. Ocean & Mint
4. Peach & Berry
5. Butter & Lilac

The design combines vivid pastel surfaces, vector-art-inspired composition, selective glassmorphism, soft depth, and motion.

## Interaction

The root experience includes:

- Mobile bottom navigation
- Animated page transitions
- Interactive search and resource filtering
- Save/bookmark state
- Resource likes/votes
- Request state transitions
- Cred redemption
- Notifications drawer
- Theme switcher
- Feature explanation sheets
- Loading-friendly card surfaces
- Reduced-motion support
- A lightweight GPU-friendly native WebGL feature-gallery scene

## Product logic represented by the UI

CampusHub remains the ecosystem for:

- Academic resources
- Campus Requests
- Monthly / Spendable / Conduct Cred
- Escrow-style request delivery
- Clubs and events
- Lost & Found
- Local student-oriented offers
- Notifications
- Reports and moderation
- Admin management

The root design currently uses local demo state so the interaction layer can be explored without a backend. It is deliberately written around backend-friendly states and should connect to the Java/Spring Boot REST backend later.

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Motion
- Lucide
- Native WebGL for the immersive feature gallery

## Running locally

```bash
pnpm install
pnpm dev
```

Then open the root route.

## Boundary

This branch is the immersive frontend/product track. It does **not** claim to contain the Java/Spring Boot backend, PostgreSQL persistence, JWT security, or production escrow/accounting implementation yet. Those belong in the backend integration layer.
