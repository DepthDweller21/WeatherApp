import { redis } from "./redis.js";
import { STANDARD_CITIES, WeatherJobPayload, EnvironmentConfig } from "./types.js";

function getConfig(): EnvironmentConfig {
    return {
        redisUrl: process.env.REDIS_URL || "redis://redis:6379",
        intervalSeconds: parseInt("60", 10),
    };
}

async function enqueueJob(): Promise<void> {
    const jobPayload: WeatherJobPayload = {
        cities: STANDARD_CITIES,
        timestamp: new Date().toISOString(),
    };

    try {
        await redis.lpush("weather-jobs", JSON.stringify(jobPayload));
        console.log(`Job enqueued at ${new Date().toISOString()} with ${jobPayload.cities.length} cities`);
    } catch (error) {
        console.error("Failed to queue job:", error);
    }
}

async function startProducer(): Promise<void> {
    const config = getConfig();
    console.log(`Producer started. queuing jobs every ${config.intervalSeconds} seconds.`);

    await enqueueJob();

    setInterval(async () => {
        await enqueueJob();
    }, config.intervalSeconds * 1000);
}

startProducer().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
