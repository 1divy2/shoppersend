import { useState } from "react";
import { Play, X, Heart, MessageCircle, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_VIDEOS = [
  {
    id: "v1",
    thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    user: "@sarah_styles",
    likes: "12.4K",
    comments: "342",
    description: "OMG this product changed my life! The quality is insane for the price. #musthave #unboxing"
  },
  {
    id: "v2",
    thumbnail: "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?w=500&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    user: "@tech_guru",
    likes: "8.9K",
    comments: "156",
    description: "Honest review after 1 month of use. Watch till the end for the final verdict! 🔥"
  },
  {
    id: "v3",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    user: "@daily_finds",
    likes: "45.2K",
    comments: "1.2K",
    description: "Can't believe I waited so long to buy this. Best purchase of 2024!"
  }
];

export function VideoReviewGrid() {
  const [activeVideo, setActiveVideo] = useState<typeof MOCK_VIDEOS[0] | null>(null);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Video Reviews <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">New</span>
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
        {MOCK_VIDEOS.map((video) => (
          <button
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className="group relative flex-shrink-0 w-40 sm:w-48 aspect-[9/16] rounded-xl overflow-hidden snap-center focus-ring transition-transform hover:scale-[1.02]"
          >
            <img src={video.thumbnail} alt={video.description} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/30 backdrop-blur-md rounded-full p-3 shadow-lg transform transition-transform group-hover:scale-110">
                <Play className="fill-white text-white" size={24} />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-3 text-left text-white">
              <div className="text-xs font-medium mb-1 truncate">{video.user}</div>
              <div className="flex items-center gap-2 text-[10px] text-white/80">
                <span className="flex items-center gap-0.5"><Heart size={10} className="fill-white/80" /> {video.likes}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-12"
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 left-4 md:top-6 md:left-6 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative flex h-full max-h-[850px] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-black md:max-w-4xl md:flex-row md:rounded-[2rem] border border-white/10"
            >
              {/* Video Player Section */}
              <div className="relative flex-1 bg-black">
                <video
                  src={activeVideo.videoUrl}
                  autoPlay
                  loop
                  controls
                  playsInline
                  className="absolute inset-0 h-full w-full object-contain md:object-cover"
                />
              </div>

              {/* Sidebar Info Section (Desktop) / Overlay (Mobile) */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 text-white md:relative md:w-80 md:bg-zinc-900 md:bg-none md:p-8 flex flex-col justify-end md:justify-start">
                <div className="md:hidden">
                  <h3 className="font-bold text-lg">{activeVideo.user}</h3>
                  <p className="mt-2 text-sm text-white/90 line-clamp-3">{activeVideo.description}</p>
                </div>

                <div className="hidden md:block">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-full bg-white/20" />
                    <div>
                      <h3 className="font-bold text-lg">{activeVideo.user}</h3>
                      <p className="text-xs text-white/60">Verified Buyer</p>
                    </div>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed mb-8">{activeVideo.description}</p>
                </div>

                <div className="flex justify-between md:justify-start md:gap-8 mt-4 md:mt-auto">
                  <button className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
                    <div className="bg-white/10 rounded-full p-3"><Heart size={24} className="fill-current" /></div>
                    <span className="text-xs font-medium">{activeVideo.likes}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
                    <div className="bg-white/10 rounded-full p-3"><MessageCircle size={24} className="fill-current" /></div>
                    <span className="text-xs font-medium">{activeVideo.comments}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
                    <div className="bg-white/10 rounded-full p-3"><Share2 size={24} /></div>
                    <span className="text-xs font-medium">Share</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
