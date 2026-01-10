"use client";

import { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Button} from "react-bootstrap";
import axios from "axios";

interface User {
    id: number;
    name: string;
    email: string;
    city: string;
}

interface ApiData {
    users: User[];
    lastUpdated: string;
}

export default function ApiExamplePage() {
    const [data, setData] = useState<ApiData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWithAxios = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<ApiData>("/api/data");
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

    useEffect(() => {fetchWithAxios();}, []);

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">Error: {error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h1>API Data Example</h1>
            <Button onClick={fetchWithAxios}>Get Data</Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>City</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.city}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}
