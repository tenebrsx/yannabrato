import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
    title: "Admin Panel | Yanna Brato",
    description: "Manage portfolio projects and settings",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Wrap admin pages with AuthProvider for authentication
    return <AuthProvider>{children}</AuthProvider>;
}
