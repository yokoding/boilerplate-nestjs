# REST API use NestJS 🇮🇩

## How to run

```bash
cd project-dir/
cp .env.example .env
docker compose up -d
```

For check status run

```bash
docker compose logs
```

## Run for development

```bash
cd project-dir/
cp .env.example .env
```

Change env value

Execute start.sh

## Links

- Swagger: <http://localhost:4000/api/docs>
- Maildev: <http://localhost:1080>

## Database utils

Generate migration

```bash
npm run migration:generate -- src/database/migrations/CreateNameTable
```

Run migration

```bash
npm run migration:run
```

Revert migration

```bash
npm run migration:revert
```

Drop all tables in database

```bash
npm run schema:drop
```

Run seed

```bash
npm run seed:run
```

## Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```
