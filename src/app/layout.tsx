"use client";

import "./globals.css";
import localFont from "next/font/local";
import { Inter, Reenie_Beanie } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CursorProvider } from "@/context/CursorContext";
import Cursor from "@/components/Cursor";
import InitialLoader from "@/components/InitialLoader";
import { slugify, sortCategories } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Configure fonts
const datatype = localFont({
  src: "../../public/fonts/Datatype.woff2",
  variable: "--font-datatype",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const reenieBeanie = Reenie_Beanie({
  variable: "--font-reenie-beanie",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const [categories, setCategories] = useState<{ label: string; href: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projects = querySnapshot.docs.map(doc => doc.data());

        // Extract and normalize categories
        const normalizedCategories = new Set<string>();
        const categoryMap = new Map<string, string>(); // slug -> original label

        projects.forEach((p: any) => {
          // Only include categories that have at least one PUBLISHED project
          if (p.category && p.published !== false) {
            const normalized = p.category.trim().toLowerCase();
            if (!normalizedCategories.has(normalized)) {
              normalizedCategories.add(normalized);
              const slug = slugify(p.category);
              // Store the first occurrence's formatting as the label, but keyed by unique slug/normalized value to avoid dups
              if (!categoryMap.has(slug)) {
                categoryMap.set(slug, p.category.trim());
              }
            }
          }
        });

        // Convert map to array
        const uniqueCategories = Array.from(categoryMap.entries()).map(([slug, label]) => ({
          label: label,
          href: `/${slug}`
        })).sort((a, b) => sortCategories(a.label, b.label));

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // For admin routes, skip the public header/footer
  if (isAdminRoute) {
    return (
      <>
        {children}
      </>
    );
  }

  // For public routes, include header/footer
  return (
    <CursorProvider>
      <Cursor />
      <SmoothScroll>
        <Header categories={categories} />
        {children}
        <Footer />
      </SmoothScroll>
    </CursorProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${datatype.variable} ${inter.variable} ${reenieBeanie.variable} antialiased bg-background text-foreground overflow-x-hidden`}
        suppressHydrationWarning
      >
        <InitialLoader />
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}
