import "reflect-metadata";
import { DataSource } from "typeorm";
import { Weather } from "./entities/Weather.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
}

export const AppDataSource = new DataSource({
    type: "postgres",
    url: connectionString,
    entities: [Weather],
    synchronize: true,
    logging: false,
});

let isInitialized = false;

export async function getDatabaseConnection(): Promise<DataSource> {
    if (!isInitialized) {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        isInitialized = true;
    }
    return AppDataSource;
}
