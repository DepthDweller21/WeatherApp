import "reflect-metadata";
import { redis } from "./redis.js";
import { getDatabaseConnection } from "./db.js";
import { Weather } from "./entities/Weather.js";
import axios from "axios";
import { WeatherJobPayload, City, OpenMeteoResponse } from "./types.js";

const QUEUE_NAME = "weather-jobs";

async function fetchWeatherData(city: City): Promise<{
    temperature: number;
    windSpeed: number;
}> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true`;

    try {
        const response = await axios.get<OpenMeteoResponse>(url);
        const { current_weather } = response.data;

        return {
            temperature: current_weather.temperature,
            windSpeed: current_weather.windspeed,
        };
    } catch (error) {
        console.error(`Error fetching weather for ${city.name}:`, error);
        throw error;
    }
}

async function processJob(jobPayload: WeatherJobPayload): Promise<void> {
    console.log(`Processing job with ${jobPayload.cities.length} cities`);

    const dataSource = await getDatabaseConnection();
    const weatherRepository = dataSource.getRepository(Weather);

    for (const city of jobPayload.cities) {
        try {
            console.log(`Fetching weather for ${city.name}...`);
            const weatherData = await fetchWeatherData(city);

            const newWeather = weatherRepository.create({
                city: city.name,
                temperature: weatherData.temperature,
                windSpeed: weatherData.windSpeed,
                lastUpdated: new Date(),
            });
            await weatherRepository.save(newWeather);

            console.log(`✓ Updated weather for ${city.name}: ${weatherData.temperature}°C, ${weatherData.windSpeed} km/h`);
        } catch (error) {
            console.error(`✗ Failed to process ${city.name}:`, error);
            // Continue with other cities even if one fails
        }
    }

    console.log("Job processing completed");
}

async function startWorker(): Promise<void> {
    console.log("Initializing database connection...");
    await getDatabaseConnection();
    console.log("Database connected. Worker started. Waiting for jobs...");

    while (true) {
        try {
            // Blocking pop from Redis queue (waits up to 5 seconds)
            const result = await redis.brpop(QUEUE_NAME, 5);

            if (result) {
                const [, jobString] = result;
                const jobPayload: WeatherJobPayload = JSON.parse(jobString);

                console.log(`Received job at ${new Date().toISOString()}`);
                await processJob(jobPayload);
            }
        } catch (error) {
            console.error("Error processing job:", error);
            // Wait a bit before retrying
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}

// Handle graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully...");
    await redis.quit();
    const dataSource = await getDatabaseConnection();
    if (dataSource.isInitialized) {
        await dataSource.destroy();
    }
    process.exit(0);
});

process.on("SIGINT", async () => {
    console.log("SIGINT received, shutting down gracefully...");
    await redis.quit();
    const dataSource = await getDatabaseConnection();
    if (dataSource.isInitialized) {
        await dataSource.destroy();
    }
    process.exit(0);
});

// Start the worker
startWorker().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
