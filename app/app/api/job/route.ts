import { NextResponse } from "next/server";
import { redis } from "../../../lib/redis";
import { STANDARD_CITIES, WeatherJobPayload } from "../../../types/weather";

const QUEUE_NAME = "weather-jobs";

export async function POST() {
    try {
        const jobPayload: WeatherJobPayload = {
            cities: STANDARD_CITIES,
            timestamp: new Date().toISOString(),
        };

        // Add job to Redis queue
        await redis.lpush(QUEUE_NAME, JSON.stringify(jobPayload));

        return NextResponse.json({
            message: "Job enqueued successfully",
            job: jobPayload,
        });
    } catch (error) {
        console.error("Error enqueuing job:", error);
        return NextResponse.json({ error: "Failed to enqueue job" }, { status: 500 });
    }
}
