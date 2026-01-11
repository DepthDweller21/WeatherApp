import "reflect-metadata";
import { NextResponse } from "next/server";
import { getDatabaseConnection } from "../../../lib/db";
import { Weather } from "../../../entities/Weather";

export async function GET() {
    try {
        const dataSource = await getDatabaseConnection();
        const weatherRepository = dataSource.getRepository(Weather);

        // Query all weather records, ordered by lastUpdated descending
        const weatherData = await weatherRepository.find({
            order: {
                lastUpdated: "DESC",
            },
        });

        // Get the most recent update timestamp
        const lastSync = weatherData.length > 0 ? weatherData[0].lastUpdated : null;

        return NextResponse.json({
            weather: weatherData,
            lastSync: lastSync,
        });
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 });
    }
}
