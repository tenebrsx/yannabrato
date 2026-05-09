"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    FolderKanban,
    Settings,
    LogOut,
    Menu,
    X,
    User,
    Flame
} from "lucide-react";
import { useState } from "react";

const navigation = [
    { name: "Panel de Control", href: "/admin", icon: LayoutDashboard },
    { name: "Proyectos", href: "/admin/projects", icon: FolderKanban },
    { name: "Configuración", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="fixed top-4 left-4 z-50 md:hidden bg-black p-2 rounded-lg shadow-lg border border-zinc-700"
            >
                {mobileMenuOpen ? (
                    <X className="h-6 w-6 text-[#637381]" />
                ) : (
                    <Menu className="h-6 w-6 text-[#637381]" />
                )}
            </button>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-56 bg-zinc-950/95 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-spring",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="h-16 border-b border-white/5 flex items-center px-6">
                        <Link href="/admin" className="hover:opacity-80 transition-opacity">
                            <h1 className="text-2xl font-reenie text-[#637381] tracking-wide">Yanna Beato</h1>
                        </Link>
                    </div>
                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-6 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== "/admin" && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200",
                                        isActive
                                            ? "bg-white/[0.04] text-[#637381] font-medium shadow-[inset_2px_0_0_0_#637381]"
                                            : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                                    )}
                                >
                                    <item.icon className={cn("h-4 w-4", isActive ? "text-[#637381]" : "text-zinc-600")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    {user && (
                        <div className="px-3 py-3 border-t border-white/5">
                            <div className="flex items-center gap-3 px-3 py-2">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName || "User"}
                                        className="h-7 w-7 rounded-full grayscale opacity-80"
                                    />
                                ) : (
                                    <div className="h-7 w-7 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                                        <User className="h-3 w-3 text-zinc-500" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-zinc-300 truncate">
                                        {user.displayName || "Admin"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Logout */}
                    <div className="p-3">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-xs font-medium text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
