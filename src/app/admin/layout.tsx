import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

export const metadata = {
    title: "Admin Panel | Yana Beato",
    description: "Manage portfolio projects and settings",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Wrap admin pages with AuthProvider for authentication
    return (
        <AuthProvider>
            {children}
            <Toaster 
                theme="dark" 
                position="bottom-right" 
                toastOptions={{
                    className: "bg-zinc-950 border-zinc-800 text-zinc-300",
                    style: {
                        fontFamily: "var(--font-inter)", 
                    }
                }}
            />
        </AuthProvider>
    );
}
