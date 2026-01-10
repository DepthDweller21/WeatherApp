import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "data", "sample.json");

        const fileContents = fs.readFileSync(filePath, "utf8");

        const data = JSON.parse(fileContents);

        return NextResponse.json(data);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Failed to read data file" }, { status: 500 });
    }
}
