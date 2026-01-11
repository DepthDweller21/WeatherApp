"use client";

import { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
import Link from "next/link";

interface WeatherRecord {
    id: number;
    city: string;
    temperature: number;
    windSpeed: number;
    lastUpdated: string;
}

interface WeatherResponse {
    weather: WeatherRecord[];
    lastSync: string | null;
}

export default function WeatherPage() {
    const [data, setData] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<WeatherResponse>("/api/weather");
            setData(response.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || err.message);
            } else {
                setError("Unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
        // Refresh every 10 seconds
        const interval = setInterval(fetchWeather, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !data) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Weather Data</h1>
                <Link href="/">
                    <Button variant="outline-primary">Back to Dashboard</Button>
                </Link>
            </div>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            {data && data.weather.length === 0 ? (
                <Alert variant="info">No weather data available yet. Go to the dashboard and click &quot;Fetch Weather Now&quot; to start fetching data.</Alert>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>City</th>
                                <th>Temperature (°C)</th>
                                <th>Wind Speed (km/h)</th>
                                <th>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.weather.map((record) => (
                                <tr key={record.id}>
                                    <td>{record.city}</td>
                                    <td>{record.temperature.toFixed(1)}</td>
                                    <td>{record.windSpeed.toFixed(1)}</td>
                                    <td>{new Date(record.lastUpdated).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {data?.lastSync && (
                        <div className="mt-3">
                            <strong>Last sync at:</strong> {new Date(data.lastSync).toLocaleString()}
                        </div>
                    )}

                    <Button variant="secondary" onClick={fetchWeather} disabled={loading} className="mt-3">
                        {loading ? (
                            <>
                                <Spinner size="sm" className="me-2" />
                                Refreshing...
                            </>
                        ) : (
                            "Refresh"
                        )}
                    </Button>
                </>
            )}
        </Container>
    );
}
