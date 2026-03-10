export interface Project {
    id: string;
    title?: string;
    category: string;

    year: string;
    thumbnail: string;
    thumbnailPoster?: string; // Optional static image for video thumbnails
    videoUrl?: string | null;
    credits?: string | null;
    description?: string | null;
    slug: string;
    createdAt?: string;
    updatedAt?: string;
}
