# Weather App - Next.js + Redis Queue + Scheduled Weather Worker

A full-stack weather application demonstrating Redis-based job queuing, automated background scheduling, and PostgreSQL data persistence.

## Architecture

The system consists of:

1. **Next.js App** (`/app`) - Frontend + API routes
   - Dashboard page with "Fetch Weather Now" button
   - Weather data display page
   - API routes for job enqueueing and weather data retrieval

2. **Worker Service** (`/worker`) - TypeScript consumer service
   - Consumes jobs from Redis queue
   - Fetches weather data from Open-Meteo API
   - Upserts data to PostgreSQL using Prisma

3. **Producer Service** (`/producer`) - TypeScript scheduler service
   - Automatically enqueues weather jobs every 60 seconds
   - Schedules jobs for 4 standard cities: London, New York, Tokyo, Cairo

4. **Redis** - Job queue connecting all services

5. **PostgreSQL** - Database storing weather data

## Prerequisites

- Docker and Docker Compose installed
- No other dependencies required - everything runs in containers

## Setup and Running

1. **Clone the repository** (if applicable)

2. **Start all services**:
   ```bash
   docker compose up --build
   ```

   This will:
   - Build and start the Next.js app on port 3000
   - Start the worker service to process jobs
   - Start the producer service to schedule jobs every 60 seconds
   - Start Redis and PostgreSQL containers

3. **Access the application**:
   - Open your browser to `http://localhost:3000`
   - Dashboard: Click "Fetch Weather Now" to manually trigger a job
   - Weather Page: View the latest weather data for all cities

## Environment Variables

The services use the following environment variables (configured in `docker-compose.yml`):

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `INTERVAL_SECONDS` - Producer scheduling interval (default: 60)

## API Endpoints

- `POST /api/job` - Enqueue a new weather-fetching job
- `GET /api/weather` - Get all stored weather data

## Database Schema

The PostgreSQL database uses Prisma with a `Weather` model:

- `id` - Primary key
- `city` - City name (unique)
- `temperature` - Temperature in Celsius
- `windSpeed` - Wind speed in km/h
- `lastUpdated` - Timestamp of last update
- `createdAt` - Record creation timestamp
- `updatedAt` - Record update timestamp

## Development

To run services individually for development:

### Next.js App
```bash
cd app
bun install
bun dev
```

### Worker
```bash
cd worker
bun install
bun run dev
```

### Producer
```bash
cd producer
bun install
bun run dev
```

## Stopping the System

Press `Ctrl+C` to stop all services, or:

```bash
docker compose down
```

To also remove volumes (database data):

```bash
docker compose down -v
```
