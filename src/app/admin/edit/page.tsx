"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Check, Smartphone, Monitor, X, Image as ImageIcon, Plus, Save } from "lucide-react";
import { motion, Reorder } from "framer-motion";
import MediaUpload from "@/components/admin/MediaUpload";
import MultiImageUpload from "@/components/admin/MultiImageUpload";

interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    thumbnail: string;
    thumbnailPoster?: string;
    description?: string;
    videoUrl?: string;
    credits?: string | { role: string; name: string }[];
    gallery?: string[];
    published?: boolean;
}

function EditContent() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("id");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
    const [project, setProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        category: "",
        thumbnail: "",
        thumbnailPoster: "",
        videoUrl: "",
        credits: [] as { role: string; name: string }[],
        gallery: [] as string[],
        published: true, // Default to true if not present
    });

    // Temp state for new gallery image input
    const [newGalleryImage, setNewGalleryImage] = useState("");

    const suggestedCategories = ["Commercial", "Music Video", "Narrative", "Spec"];

    useEffect(() => {
        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const fetchProject = async () => {
        if (!projectId) return;
        try {
            const docRef = doc(db, "projects", projectId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const found = { id: docSnap.id, ...docSnap.data() } as Project;
                setProject(found);
                
                let parsedCredits = found.credits || [];
                if (typeof parsedCredits === 'string') {
                    parsedCredits = parsedCredits.split(/·|-/).map((c: string) => ({ role: "Crédito", name: c.trim() }));
                }

                setFormData({
                    title: found.title,
                    slug: found.slug,
                    description: found.description || "",
                    category: found.category,
                    thumbnail: found.thumbnail,
                    thumbnailPoster: found.thumbnailPoster || "",
                    videoUrl: found.videoUrl || "",
                    credits: parsedCredits as { role: string; name: string }[],
                    gallery: found.gallery || [],
                    published: found.published !== false, // Defaults to true if undefined
                });
            } else {
                console.error("No such project!");
            }
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setFetching(false);
        }
    };

    // Add gallery images
    const addGalleryImages = (urls: string[]) => {
        if (!urls.length) return;
        setFormData(prev => ({
            ...prev,
            gallery: [...(prev.gallery || []), ...urls]
        }));
    };

    // Remove gallery image
    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    // Add Credit
    const addCredit = () => {
        setFormData(prev => ({
            ...prev,
            credits: [...prev.credits, { role: "", name: "" }]
        }));
    };

    // Update Credit
    const updateCredit = (index: number, field: "role" | "name", value: string) => {
        const newCredits = [...formData.credits];
        newCredits[index][field] = value;
        setFormData(prev => ({ ...prev, credits: newCredits }));
    };

    // Remove Credit
    const removeCredit = (index: number) => {
        setFormData(prev => ({
            ...prev,
            credits: prev.credits.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!project || !projectId) return;
        setLoading(true);

        try {
            const docRef = doc(db, "projects", projectId);
            await updateDoc(docRef, {
                ...formData,
                updatedAt: serverTimestamp(),
            });

            toast.success("Proyecto actualizado exitosamente");
            router.push("/admin");
        } catch (error) {
            console.error("Error updating project:", error);
            toast.error("Hubo un error al actualizar el proyecto.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
            </div>
        );
    }

    if (!project) return null;

    return (
        <ProtectedRoute>
            <AdminLayout>
                <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-6 lg:gap-0 lg:-m-8">
                    {/* Left: Editor (Scrollable) */}
                    <div className="flex-1 lg:max-w-xl xl:max-w-2xl lg:border-r border-white/10 lg:h-full lg:overflow-y-auto p-6 lg:p-10 bg-black">
                        <div className="max-w-xl mx-auto space-y-8 pb-32">
                            {/* Sticky Header Action Bar */}
                            <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl pb-4 pt-2 -mx-6 px-6 sm:-mx-10 sm:px-10 border-b border-white/5 flex items-center justify-between">
                                <div>
                                    <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#637381] transition-colors mb-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        Volver al Panel
                                    </Link>
                                    <h1 className="text-3xl font-bold tracking-tight text-[#637381]">Editar Proyecto</h1>
                                    <p className="text-zinc-500 text-xs mt-1">Editando: {project.title}</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button 
                                        onClick={handleSubmit} 
                                        disabled={loading} 
                                        className="shadow-xl shadow-orange-900/20 bg-orange-600 hover:bg-orange-500 text-white"
                                    >
                                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                        {loading ? "Guardando..." : "Guardar Cambios"}
                                    </Button>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* SECTION 1: Configuración General */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                                        <div className="h-px flex-1 bg-zinc-800"></div>
                                        <span className="text-xs font-mono uppercase tracking-widest text-[#637381]">1. Configuración General</span>
                                        <div className="h-px flex-1 bg-zinc-800"></div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-lg border border-zinc-800/50">
                                        <div>
                                            <Label className="font-mono text-zinc-400 text-sm">ESTADO DE PUBLICACIÓN</Label>
                                            <p className="text-xs text-zinc-500 mt-1">
                                                {formData.published 
                                                    ? "Visible inmediatamente en el sitio público." 
                                                    : "Guardado como borrador (oculto)."}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, published: !prev.published }))}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#637381] focus:ring-offset-2 focus:ring-offset-black ${
                                                formData.published ? 'bg-orange-500' : 'bg-zinc-700'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                    formData.published ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* SECTION 2: Información Principal */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                                        <div className="h-px flex-1 bg-zinc-800"></div>
                                        <span className="text-xs font-mono uppercase tracking-widest text-[#637381]">2. Información Principal</span>
                                        <div className="h-px flex-1 bg-zinc-800"></div>
                                    </div>

                                    <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-xl p-6 space-y-6">
                                        <div className="space-y-3">
                                            <Label htmlFor="title" className="font-mono text-zinc-400 text-xs">TÍTULO DEL PROYECTO *</Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="ej. Midnight Echo"
                                                className="h-12 text-lg bg-zinc-950 border-zinc-800 focus:border-[#637381] focus:ring-[#637381] transition-all"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Label htmlFor="slug" className="font-mono text-zinc-400 text-xs">URL SLUG *</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="slug"
                                                        name="slug"
                                                        value={project.slug}
                                                        disabled
                                                        className="bg-zinc-950 border-zinc-800 text-zinc-500 font-mono text-sm cursor-not-allowed"
                                                    />
                                                </div>
                                                <p className="text-xs text-zinc-600 mt-1">Los slugs no se pueden cambiar después de la creación.</p>
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="category" className="font-mono text-zinc-400 text-xs">CATEGORÍA *</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="category"
                                                        name="category"
                                                        value={formData.category}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Selecciona o escribe..."
                                                        list="category-suggestions-edit"
                                                        className="bg-zinc-950 border-zinc-800 focus:border-[#637381] focus:ring-[#637381]"
                                                    />
                                                    <datalist id="category-suggestions-edit">
                                                        {suggestedCategories.map(cat => (
                                                            <option key={cat} value={cat} />
                                                        ))}
                                                    </datalist>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 3: Media */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                                        <div className="h-px flex-1 bg-zinc-800"></div>
                                        <span className="text-xs font-mono uppercase tracking-widest text-[#637381]">3. Media & Visuales</span>
                                        <div className="h-px flex-1 bg-zinc-800"></div>
                                    </div>

                                    <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-xl p-6 space-y-8">
                                        <div className="space-y-3">
                                            <Label className="font-mono text-zinc-400 text-xs">THUMBNAIL / VIDEO PRINCIPAL *</Label>
                                            <MediaUpload
                                                value={formData.thumbnail}
                                                onChange={(url) => setFormData(prev => ({ ...prev, thumbnail: url }))}
                                                onPosterGenerated={(url) => setFormData(prev => ({ ...prev, thumbnailPoster: url }))}
                                                folder="thumbnails"
                                                label="Subir Thumbnail (MP4, GIF, JPG)"
                                            />
                                        </div>

                                        {/* Optional Poster for Videos */}
                                        {formData.thumbnail && (formData.thumbnail.includes(".mp4") || formData.thumbnail.includes(".webm")) && (
                                            <div className="space-y-3 pl-4 border-l-2 border-[#637381]/30">
                                                <div>
                                                    <Label className="font-mono text-zinc-400 text-xs">IMAGEN DE PORTADA (POSTER)</Label>
                                                    <p className="text-xs text-zinc-500 mt-1 mb-3">Evita pantallas negras mientras carga el video principal.</p>
                                                </div>
                                                <MediaUpload
                                                    value={formData.thumbnailPoster}
                                                    onChange={(url) => setFormData(prev => ({ ...prev, thumbnailPoster: url }))}
                                                    folder="thumbnails"
                                                    label="Subir Imagen Estática"
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-3 pt-4 border-t border-zinc-800/50">
                                            <Label htmlFor="videoUrl" className="font-mono text-zinc-400 text-xs">ENLACE DE VIDEO EXTERNO (OPCIONAL)</Label>
                                            <Input
                                                id="videoUrl"
                                                name="videoUrl"
                                                type="url"
                                                value={formData.videoUrl}
                                                onChange={handleChange}
                                                placeholder="https://youtube.com/..."
                                                className="bg-zinc-950 border-zinc-800 focus:border-[#637381] focus:ring-[#637381]"
                                            />
                                            <p className="text-xs text-zinc-500">Si se proporciona, el proyecto se abrirá como un reproductor de video en lugar de una galería estática.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 4: Metadatos */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                                        <div className="h-px flex-1 bg-zinc-800"></div>
                                        <span className="text-xs font-mono uppercase tracking-widest text-[#637381]">4. Metadatos & Detalles</span>
                                        <div className="h-px flex-1 bg-zinc-800"></div>
                                    </div>

                                    <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-xl p-6 space-y-8">
                                        <div className="space-y-3">
                                            <Label htmlFor="description" className="font-mono text-zinc-400 text-xs">SINOPSIS / DESCRIPCIÓN</Label>
                                            <Textarea
                                                id="description"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={4}
                                                placeholder="Describe the project..."
                                                className="resize-none bg-zinc-950 border-zinc-800 focus:border-[#637381] focus:ring-[#637381]"
                                            />
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                                            <div className="flex items-center justify-between">
                                                <Label className="font-mono text-zinc-400 text-xs">CRÉDITOS TÉCNICOS</Label>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={addCredit}
                                                    className="h-8 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/5"
                                                >
                                                    <Plus className="h-3 w-3 mr-2" />
                                                    Añadir Rol
                                                </Button>
                                            </div>

                                            <div className="space-y-3">
                                                {formData.credits.map((credit, idx) => (
                                                    <div key={idx} className="flex gap-3 items-start group">
                                                        <Input
                                                            placeholder="Rol (ej. Director)"
                                                            value={credit.role}
                                                            onChange={(e) => updateCredit(idx, "role", e.target.value)}
                                                            className="bg-zinc-950 border-zinc-800 flex-1 focus:border-[#637381] focus:ring-[#637381]"
                                                        />
                                                        <Input
                                                            placeholder="Nombre"
                                                            value={credit.name}
                                                            onChange={(e) => updateCredit(idx, "name", e.target.value)}
                                                            className="bg-zinc-950 border-zinc-800 flex-1 focus:border-[#637381] focus:ring-[#637381]"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeCredit(idx)}
                                                            className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10 opacity-50 group-hover:opacity-100 transition-all shrink-0"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                {formData.credits.length === 0 && (
                                                    <div className="text-center py-6 border border-dashed border-zinc-800 rounded-lg bg-zinc-950/50">
                                                        <p className="text-xs text-zinc-500 font-mono">Sin créditos añadidos</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 5: Galería */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                                        <div className="h-px flex-1 bg-zinc-800"></div>
                                        <span className="text-xs font-mono uppercase tracking-widest text-[#637381]">5. Galería (Opcional)</span>
                                        <div className="h-px flex-1 bg-zinc-800"></div>
                                    </div>

                                    <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-xl p-6 space-y-4">
                                        <MultiImageUpload
                                            onUpload={addGalleryImages}
                                            label="Arrastra imágenes aquí o haz click"
                                            folder="gallery"
                                        />

                                        {/* Gallery List */}
                                        <div className="space-y-2 mt-4">
                                            {formData.gallery?.map((url, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-2 bg-zinc-950 rounded border border-zinc-800 group">
                                                    <div className="h-12 w-20 bg-zinc-900 rounded overflow-hidden shrink-0 relative border border-white/5">
                                                        <img src={url} alt="" className="h-full w-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-zinc-500 font-mono truncate">{url.split('/').pop()?.split('?')[0] || url}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(idx)}
                                                        className="p-2 hover:bg-red-500/10 hover:text-red-400 text-zinc-600 rounded transition-colors opacity-50 group-hover:opacity-100"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            {(!formData.gallery || formData.gallery.length === 0) && (
                                                <div className="text-center py-8 border border-dashed border-zinc-800 rounded-lg">
                                                    <p className="text-xs text-zinc-500 font-mono">La galería está vacía</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right: Live Preview (Fixed) */}
                    <div className="hidden lg:flex flex-1 bg-zinc-950 items-center justify-center p-8 relative overflow-hidden">
                        {/* Background Grid Pattern */}
                        <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }} />

                        <div className="relative z-10 w-full max-w-2xl flex flex-col h-full max-h-[800px]">
                            {/* Device Controls */}
                            <div className="bg-zinc-900/80 backdrop-blur-md rounded-t-xl border border-white/10 p-3 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500/20" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
                                    <div className="h-3 w-3 rounded-full bg-green-500/20" />
                                </div>
                                <div className="flex gap-1 bg-black/50 p-1 rounded-lg">
                                    <button
                                        onClick={() => setPreviewMode("desktop")}
                                        className={`p-1.5 rounded-md transition-all ${previewMode === "desktop" ? "bg-zinc-800 text-[#637381]" : "text-zinc-500 hover:text-zinc-300"}`}
                                    >
                                        <Monitor className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setPreviewMode("mobile")}
                                        className={`p-1.5 rounded-md transition-all ${previewMode === "mobile" ? "bg-zinc-800 text-[#637381]" : "text-zinc-500 hover:text-zinc-300"}`}
                                    >
                                        <Smartphone className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Device Frame */}
                            <div className={`
                                bg-black border-x border-b border-white/10 shadow-2xl transition-all duration-500 ease-in-out flex-1 overflow-hidden relative
                                ${previewMode === "mobile" ? "max-w-[375px] mx-auto rounded-b-3xl border-b-8 border-b-zinc-900" : "w-full rounded-b-xl"}
                            `}>
                                {/* Mock Site Content */}
                                <div className="h-full overflow-y-auto bg-black text-[#637381]">
                                    {/* Mock Header */}
                                    <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 sticky top-0 bg-black/80 backdrop-blur z-20">
                                        <div className="text-sm font-bold uppercase tracking-widest">Admin</div>
                                        <div className="h-4 w-4 rounded-full border border-white/50" />
                                    </div>

                                    {/* Mock Hero Project */}
                                    <div className="p-6 space-y-6">
                                        <div className="aspect-video bg-zinc-950 rounded border border-white/5 overflow-hidden relative group">
                                            {formData.thumbnail ? (
                                                formData.thumbnail.includes(".mp4") || formData.thumbnail.includes(".webm") ? (
                                                    <video
                                                        src={formData.thumbnail}
                                                        className="w-full h-full object-cover grayscale opacity-80"
                                                        muted
                                                        loop
                                                        playsInline
                                                        // Auto-play in preview
                                                        autoPlay
                                                    />
                                                ) : (
                                                    <img
                                                        src={formData.thumbnail}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover grayscale opacity-80"
                                                    />
                                                )
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 gap-2">
                                                    <div className="h-10 w-10 border-2 border-dashed border-zinc-800 rounded flex items-center justify-center">
                                                        <ImageIcon className="h-4 w-4 text-zinc-600" />
                                                    </div>
                                                    <span className="text-xs font-mono">SIN MEDIA</span>
                                                </div>
                                            )}

                                            {/* Hover info overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
                                                <span className="text-xs font-mono tracking-widest uppercase text-white border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-colors cursor-pointer">
                                                    Ver Proyecto
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white leading-none">
                                                    {formData.title || "SIN TÍTULO"}
                                                </h1>
                                                <span className="text-[10px] font-mono border border-white/10 px-2 py-1 rounded text-zinc-500 uppercase tracking-wider">
                                                    {formData.category || "SIN CAT"}
                                                </span>
                                            </div>

                                            {formData.description ? (
                                                <p className="text-zinc-400 text-sm leading-relaxed max-w-lg font-light">
                                                    {formData.description}
                                                </p>
                                            ) : (
                                                <div className="space-y-2 opacity-50">
                                                    <div className="h-2 w-full bg-zinc-900 rounded animate-pulse" />
                                                    <div className="h-2 w-2/3 bg-zinc-900 rounded animate-pulse" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Gallery Preview */}
                                        {formData.gallery && formData.gallery.length > 0 && (
                                            <div className="space-y-4 pt-6 border-t border-white/10">
                                                <div className="flex items-center gap-2">
                                                    <ImageIcon className="h-4 w-4 text-zinc-500" />
                                                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Vista Previa de Galería</h3>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {formData.gallery.map((url, i) => (
                                                        <div key={i} className="aspect=[4/5] bg-zinc-900 rounded overflow-hidden">
                                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}

export default function EditProjectPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
            </div>
        }>
            <EditContent />
        </Suspense>
    );
}
