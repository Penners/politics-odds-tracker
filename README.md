## View Deployment

[https://politics-odds-tracker.vercel.app/](https://politics-odds-tracker.vercel.app/)

## Deployment requirements

- Turso SQLite

## Getting Started Running locally

First, run the migrations

```bash
npm run migrate:run
```

Second, start the dev server

```bash
npm run dev
```

## Deploying to vercel

add the following turso secrets to your vercel environment variables

- DATABASE_URL
- DATABASE_AUTH_TOKEN
