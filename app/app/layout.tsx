import { ReactNode } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Navbar from "../components/navbar";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html data-bs-theme="dark" suppressHydrationWarning>
            <head></head>
            <body className="">
                <Navbar />
                {children}
            </body>
        </html>
    );
}
