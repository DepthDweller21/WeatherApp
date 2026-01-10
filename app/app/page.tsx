"use client";
import { Button } from "react-bootstrap";
import { useState } from "react";

export default function Page() {
    const [count, setCount] = useState(0);

    return <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>;
}
