# Notes App

A note-taking app with user authentication built with Node.js, Express, and PostgreSQL.

## Setup

1. Install dependencies: `npm install`
2. Create a `.env` file from `.env.example` and fill in your database credentials
3. Create the database and run the migration:

```bash
psql -U postgres -c "CREATE DATABASE notes_app;"
psql -U postgres -d notes_app -f src/db/migrations/001_initial_schema.sql
```