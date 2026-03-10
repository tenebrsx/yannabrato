"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        try {
            // Use mailto fallback for now (no backend needed)
            const subject = encodeURIComponent(`Contacto Web — ${formData.name}`);
            const body = encodeURIComponent(
                `Nombre: ${formData.name}\nEmail: ${formData.email}\n\nMensaje:\n${formData.message}`
            );
            window.location.href = `mailto:yannambeatom24@gmail.com?subject=${subject}&body=${body}`;
            setSent(true);
            setFormData({ name: "", email: "", message: "" });
        } catch {
            alert("Error al enviar. Intente de nuevo.");
        } finally {
            setSending(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label htmlFor="name" className="font-mono text-xs text-zinc-500 uppercase tracking-wider block mb-2">Nombre</label>
                <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-transparent border-b border-zinc-700 pb-2 text-[#D5E8D4] font-sans text-base focus:outline-none focus:border-[#D5E8D4] transition-colors placeholder:text-zinc-700"
                    placeholder="Tu nombre"
                />
            </div>
            <div>
                <label htmlFor="email" className="font-mono text-xs text-zinc-500 uppercase tracking-wider block mb-2">Email</label>
                <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-transparent border-b border-zinc-700 pb-2 text-[#D5E8D4] font-sans text-base focus:outline-none focus:border-[#D5E8D4] transition-colors placeholder:text-zinc-700"
                    placeholder="tu@email.com"
                />
            </div>
            <div>
                <label htmlFor="message" className="font-mono text-xs text-zinc-500 uppercase tracking-wider block mb-2">Mensaje</label>
                <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-transparent border-b border-zinc-700 pb-2 text-[#D5E8D4] font-sans text-base focus:outline-none focus:border-[#D5E8D4] transition-colors resize-none placeholder:text-zinc-700"
                    placeholder="Escribe tu mensaje..."
                />
            </div>
            <button
                type="submit"
                disabled={sending || sent}
                className="inline-flex items-center gap-3 px-6 py-3 border border-zinc-700 rounded-full font-mono text-xs uppercase tracking-widest text-zinc-300 hover:bg-[#D5E8D4] hover:text-black hover:border-[#D5E8D4] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                {sent ? (
                    <>
                        <CheckCircle className="h-4 w-4" />
                        Enviado
                    </>
                ) : sending ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                    </>
                ) : (
                    <>
                        <Send className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        Enviar Mensaje
                    </>
                )}
            </button>
        </form>
    );
}
