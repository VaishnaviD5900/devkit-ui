# DevKit UI

> Build UI components visually. Pick your framework. Copy the code. Ship faster.

A visual component builder that generates production-ready code for the most popular UI frameworks — shadcn/ui, Material UI, Vuetify, Angular Material, and Tailwind CSS.

## Packages

| Package | Description |
|---|---|
| `apps/web` | React frontend — the visual builder |
| `apps/api` | Fastify backend — auth, saved configs, AI |
| `packages/types` | Shared TypeScript types |
| `packages/generators` | Code generation logic per framework |

## Tech Stack

- **Frontend**: React 19, TypeScript, TanStack Router, Zustand, Tailwind CSS, shadcn/ui
- **Backend**: Fastify, tRPC, Prisma, Supabase
- **Monorepo**: Turborepo, pnpm workspaces
- **CI/CD**: GitHub Actions, Vercel (web), Railway (api)

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9

### Install

```bash
pnpm install
```

### Develop

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Typecheck

```bash
pnpm typecheck
```

### Lint

```bash
pnpm lint
```

## Project Structure

```
devkit-ui/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # Fastify backend
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── generators/   # Code generation logic
├── .github/
│   └── workflows/    # CI/CD pipelines
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Contributing

1. Create a branch from `develop`
2. Make your changes
3. Open a PR into `develop`
4. `main` is production only

## License

MIT
