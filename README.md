## Deployment requirements

- Turso SQLite

## Getting Started

First, run the migrations

```bash
npm run migrate:run
```

Second, start the dev server

```bash
npm run dev
```

## Deploying to vercel

add the following turso secrets to your vercel account

- DATABASE_URL
- DATABASE_AUTH_TOKEN
