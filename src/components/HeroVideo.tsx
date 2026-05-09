"use client";

import { motion } from "framer-motion";

interface HeroVideoProps {
    videoUrl?: string;
}

export default function HeroVideo({ videoUrl }: HeroVideoProps) {
    const src = videoUrl || "https://videos.pexels.com/video-files/3121459/3121459-hd_1920_1080_25fps.mp4";

    const getVideoInfo = (url: string) => {
        // YouTube
        const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const ytMatch = url.match(ytRegExp);
        if (ytMatch && ytMatch[2].length === 11) {
            return { platform: 'youtube', id: ytMatch[2] };
        }

        // Vimeo
        const vimeoRegExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
        const vimeoMatch = url.match(vimeoRegExp);
        if (vimeoMatch && vimeoMatch[1]) {
            return { platform: 'vimeo', id: vimeoMatch[1] };
        }

        return null;
    };

    const videoInfo = getVideoInfo(src);

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            {/* Subtle Overlay for Text Readability */}
            <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

            {videoInfo ? (
                <div className="absolute w-[300vw] h-[300vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    {videoInfo.platform === 'youtube' ? (
                        <iframe
                            loading="lazy"
                            src={`https://www.youtube.com/embed/${videoInfo.id}?autoplay=1&mute=1&loop=1&playlist=${videoInfo.id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1`}
                            title="Hero Background Video"
                            className="w-full h-full object-cover mix-blend-screen scale-[1.5]"
                            allow="autoplay; encrypted-media"
                        />
                    ) : (
                        <iframe
                            loading="lazy"
                            src={`https://player.vimeo.com/video/${videoInfo.id}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                            className="w-full h-full mix-blend-screen scale-[1.5]"
                            allow="autoplay; fullscreen"
                        />
                    )}
                </div>
            ) : src.toLowerCase().endsWith(".gif") ? (
                <img
                    src={src}
                    alt="Hero Background"
                    className="w-full h-full object-cover"
                />
            ) : (
                <video
                    key={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={src} type={src.includes(".mov") ? "video/quicktime" : "video/mp4"} />
                </video>
            )}

        </div>
    );
}
