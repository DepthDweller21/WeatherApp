"use client";
import { Button, Container, Spinner, Alert } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFetchWeather = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await axios.post("/api/job");
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || "Failed to enqueue job");
            } else {
                setError("Failed to enqueue job");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            <h1>Weather Dashboard</h1>
            <div className="mb-4">
                <Button variant="primary" onClick={handleFetchWeather} disabled={loading} className="me-2">
                    {loading ? (
                        <>
                            <Spinner size="sm" className="me-2" />
                            Enqueuing...
                        </>
                    ) : (
                        "Fetch Weather Now"
                    )}
                </Button>
                <Link href="/weather">
                    <Button variant="outline-primary">View Weather Data</Button>
                </Link>
            </div>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            {success && (
                <Alert variant="success" className="mb-4">
                    Job enqueued successfully! Weather data will be updated shortly.
                </Alert>
            )}

            <p className="text-muted">Click &quot;Fetch Weather Now&quot; to manually trigger a weather data fetch for London, New York, Tokyo, and Cairo. The producer service also automatically fetches weather data every 60 seconds.</p>
        </Container>
    );
}
