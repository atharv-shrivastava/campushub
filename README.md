# CampusHub

A student-focused academic resource hub and campus Lost & Found web application prototype.

CampusHub brings notes, assignments, practical files, previous-year questions, lab manuals and syllabus material into a searchable, subject-organized library, with bookmarking, upload workflows and a Lost & Found experience.

## Documentation

See the complete project documentation, including:

- product overview and feature workflows
- current frontend implementation
- tech stack and project structure
- resource/search/upload/saved workflows
- Lost & Found workflow and matching
- planned authentication and authorization
- planned Node.js + Express backend
- PostgreSQL + Prisma data model
- REST API specification
- file storage and PDF processing
- voting and 10-downvote moderation workflow
- notifications, security, pagination and deployment guidance

[Read DOCUMENTATION.md](./DOCUMENTATION.md)

## Current status

The repository currently contains the polished Next.js frontend prototype with local/mock data. The full-stack backend described in the documentation is the target architecture and is not yet implemented in this repository.

## Run locally

This is a Next.js project.

Install dependencies:

```bash
pnpm install
```

Run development:

```bash
pnpm dev
```

Build:

```bash
pnpm build
```

Start production:

```bash
pnpm start
```

The development server runs at http://localhost:3000.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Motion
- Lucide React

The planned production stack adds Node.js + Express, PostgreSQL, Prisma, authentication, persistent storage and REST APIs.
