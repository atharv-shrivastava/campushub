# CampusHub

A college-focused student community and discovery platform.

## Current build

This repository currently contains the first frontend foundation:
- Responsive student dashboard and navigation shell
- Sponsored local-business promotion cards
- Community shortcuts
- Recently uploaded academic resource cards
- Trending event cards
- Campus discussion preview
- Karma progress and community pulse panels
- Opaque glassmorphism-inspired surfaces (solid fills, layered shadows and edge highlights)

The content is sample UI data. Authentication, backend APIs, persistence, payments, moderation workflows and live business/event data are not connected yet.

## Run locally

Requirements: Node.js 20.19+ or 22.12+, and pnpm.

```bash
pnpm install
pnpm dev
```

Create a production build:

```bash
pnpm build
pnpm preview
```

## Design direction

The interface uses a dark campus-night palette with solid, opaque surfaces. Depth comes from layered fills, restrained gradients, border highlights and shadows rather than transparent cards.
