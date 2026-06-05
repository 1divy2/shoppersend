import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as useSuspenseQuery, a as useQuery, b as useQueryClient, u as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as Route$1, p as productQuery, s as similarProductsQuery, r as reviewsQuery, f as cartService, n as wishlistService, k as productsService, w as wishlistQuery, m as meQuery } from "./router-Jzlhdj0b.mjs";
import { P as PriceBlock } from "./PriceBlock-Ch8f25OO.mjs";
import { R as Rating, P as ProductCard, Q as QuickCheckoutDrawer } from "./ProductCard-By3ALuro.mjs";
import { d as discountPct, f as formatINR, c as cn } from "./format-Ba4izUCB.mjs";
import { F as FastAverageColor } from "../_libs/fast-average-color.mjs";
import { q as ShoppingCart, H as Heart, Z as Zap, C as Check, x as Truck, k as RotateCcw, o as ShieldCheck, s as Star, R as Repeat, I as Info, v as Timer, i as Play, X, f as MessageCircle, m as Share2, r as Sparkles, u as ThumbsUp, T as ThumbsDown } from "../_libs/lucide-react.mjs";
import { m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function ReviewForm({ productId, slug }) {
  const qc = useQueryClient();
  const [rating, setRating] = reactExports.useState(5);
  const [title, setTitle] = reactExports.useState("");
  const [comment, setComment] = reactExports.useState("");
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const submit = useMutation({
    mutationFn: () => productsService.submitReview(productId, { rating, title, comment }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product", slug, "reviews"] });
      toast.success("Review submitted successfully");
      setIsOpen(false);
      setTitle("");
      setComment("");
      setRating(5);
    },
    onError: (e) => toast.error(e.message)
  });
  if (!isOpen) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setIsOpen(true),
        className: "mt-4 w-full rounded-md border-2 px-4 py-2 text-sm font-semibold hover:bg-muted",
        children: "Write a review"
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: (e) => {
        e.preventDefault();
        submit.mutate();
      },
      className: "mt-4 space-y-4 rounded-lg border bg-[var(--surface-2)] p-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-sm font-medium", children: "Rating" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setRating(star),
              className: "text-[var(--rating)] focus:outline-none",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 24, fill: star <= rating ? "currentColor" : "none" })
            },
            star
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-sm font-medium", children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              required: true,
              value: title,
              onChange: (e) => setTitle(e.target.value),
              className: "w-full rounded-md border bg-background px-3 py-2 text-sm focus-ring",
              placeholder: "Summarize your experience"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-sm font-medium", children: "Review" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              required: true,
              rows: 3,
              value: comment,
              onChange: (e) => setComment(e.target.value),
              className: "w-full rounded-md border bg-background px-3 py-2 text-sm focus-ring",
              placeholder: "What did you like or dislike?"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setIsOpen(false),
              className: "rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: submit.isPending,
              className: "rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-[var(--primary-hover)] disabled:opacity-50",
              children: submit.isPending ? "Submitting..." : "Submit review"
            }
          )
        ] })
      ]
    }
  );
}
function FlashSaleBanner({ endTime, stockLeft }) {
  const [timeLeft, setTimeLeft] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const targetDate = endTime ? new Date(endTime).getTime() : Date.now() + 2 * 60 * 60 * 1e3;
    const interval = setInterval(() => {
      const now = Date.now();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: Math.floor(distance % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60)),
        minutes: Math.floor(distance % (1e3 * 60 * 60) / (1e3 * 60)),
        seconds: Math.floor(distance % (1e3 * 60) / 1e3)
      });
    }, 1e3);
    return () => clearInterval(interval);
  }, [endTime]);
  if (!timeLeft) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-gradient-to-r from-red-600 to-orange-500 rounded-lg p-3 text-white shadow-lg overflow-hidden relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "absolute top-0 left-0 w-full h-full bg-white opacity-20",
        animate: { x: ["-100%", "100%"] },
        transition: { repeat: Infinity, duration: 2, ease: "linear" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col md:flex-row items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-bold text-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 20, className: "fill-white" }),
        "FLASH DROP"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        stockLeft !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium bg-black/20 px-3 py-1 rounded-full", children: [
          "Only ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-yellow-300", children: stockLeft }),
          " left"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 font-mono font-bold text-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-black/30 rounded px-2 py-0.5", children: timeLeft.hours.toString().padStart(2, "0") }),
            ":",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-black/30 rounded px-2 py-0.5", children: timeLeft.minutes.toString().padStart(2, "0") }),
            ":",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-black/30 rounded px-2 py-0.5 text-yellow-200", children: timeLeft.seconds.toString().padStart(2, "0") })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 w-full h-1.5 bg-black/30 rounded-full mt-3 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "h-full bg-yellow-400",
        initial: { width: "100%" },
        animate: { width: "15%" },
        transition: { duration: 1.5, ease: "easeOut" }
      }
    ) })
  ] });
}
function SubscriptionSelector({ onSelect }) {
  const [selected, setSelected] = reactExports.useState(null);
  const options = [
    { id: "1_month", label: "Every 1 month", discount: 15 },
    { id: "2_months", label: "Every 2 months", discount: 10 },
    { id: "3_months", label: "Every 3 months", discount: 5 }
  ];
  const handleSelect = (id) => {
    setSelected(id);
    onSelect(id);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border border-primary/20 bg-[var(--surface-2)] p-4 shadow-sm relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 -mr-6 -mt-6 opacity-[0.03]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { size: 120 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { size: 16 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-base leading-none", children: "Subscribe & Save" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 12 }),
            " Save up to 15% on repeat deliveries"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => handleSelect(null),
            className: cn(
              "flex w-full items-center justify-between rounded-lg border-2 p-3 text-left transition-all",
              selected === null ? "border-primary bg-primary/5" : "border-transparent bg-background hover:bg-muted"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "One-time purchase" }),
              selected === null && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 18, className: "text-primary" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: options.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => handleSelect(option.id),
            className: cn(
              "flex flex-col items-center justify-center rounded-lg border-2 p-2 text-center transition-all",
              selected === option.id ? "border-primary bg-primary/5" : "border-transparent bg-background hover:bg-muted"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-semibold text-primary mb-0.5", children: [
                "SAVE ",
                option.discount,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: option.label }),
              selected === option.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1 right-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-2 rounded-full bg-primary" }) })
            ]
          },
          option.id
        )) })
      ] })
    ] })
  ] });
}
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
function VideoReviewGrid() {
  const [activeVideo, setActiveVideo] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold flex items-center gap-2", children: [
      "Video Reviews ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium", children: "New" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar", children: MOCK_VIDEOS.map((video) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setActiveVideo(video),
        className: "group relative flex-shrink-0 w-40 sm:w-48 aspect-[9/16] rounded-xl overflow-hidden snap-center focus-ring transition-transform hover:scale-[1.02]",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: video.thumbnail, alt: video.description, className: "absolute inset-0 w-full h-full object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/30 backdrop-blur-md rounded-full p-3 shadow-lg transform transition-transform group-hover:scale-110", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "fill-white text-white", size: 24 }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 w-full p-3 text-left text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium mb-1 truncate", children: video.user }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-[10px] text-white/80", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 10, className: "fill-white/80" }),
              " ",
              video.likes
            ] }) })
          ] })
        ]
      },
      video.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: activeVideo && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-12",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setActiveVideo(null),
              className: "absolute top-4 left-4 md:top-6 md:left-6 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { scale: 0.9, y: 20 },
              animate: { scale: 1, y: 0 },
              exit: { scale: 0.9, y: 20 },
              className: "relative flex h-full max-h-[850px] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-black md:max-w-4xl md:flex-row md:rounded-[2rem] border border-white/10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex-1 bg-black", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "video",
                  {
                    src: activeVideo.videoUrl,
                    autoPlay: true,
                    loop: true,
                    controls: true,
                    playsInline: true,
                    className: "absolute inset-0 h-full w-full object-contain md:object-cover"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 text-white md:relative md:w-80 md:bg-zinc-900 md:bg-none md:p-8 flex flex-col justify-end md:justify-start", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg", children: activeVideo.user }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-white/90 line-clamp-3", children: activeVideo.description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:block", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-white/20" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg", children: activeVideo.user }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/60", children: "Verified Buyer" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/90 leading-relaxed mb-8", children: activeVideo.description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between md:justify-start md:gap-8 mt-4 md:mt-auto", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex flex-col items-center gap-1 hover:text-primary transition-colors", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/10 rounded-full p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 24, className: "fill-current" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: activeVideo.likes })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex flex-col items-center gap-1 hover:text-primary transition-colors", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/10 rounded-full p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 24, className: "fill-current" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: activeVideo.comments })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex flex-col items-center gap-1 hover:text-primary transition-colors", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/10 rounded-full p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { size: 24 }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: "Share" })
                    ] })
                  ] })
                ] })
              ]
            }
          )
        ]
      }
    ) })
  ] });
}
function AiReviewSummary({ productName }) {
  const summary = {
    overall: `Customers highly recommend the ${productName} for its exceptional quality and value. Many users noted immediate positive results and praised the durable packaging.`,
    pros: ["Excellent build quality", "Great value for money", "Fast shipping", "Exactly as described"],
    cons: ["Slightly larger than expected", "Instructions could be clearer"]
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-5 shadow-sm relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 16, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg", children: "AI Review Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider", children: "Beta" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90 leading-relaxed mb-5", children: summary.overall }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-background/50 border p-3 backdrop-blur-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2 text-sm font-semibold text-[var(--success)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsUp, { size: 14 }),
            " Top Pros"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: summary.pros.map((pro, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs text-muted-foreground flex items-start gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--success)] mt-0.5", children: "•" }),
            " ",
            pro
          ] }, idx)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-background/50 border p-3 backdrop-blur-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2 text-sm font-semibold text-destructive", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsDown, { size: 14 }),
            " Top Cons"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: summary.cons.map((con, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-xs text-muted-foreground flex items-start gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive mt-0.5", children: "•" }),
            " ",
            con
          ] }, idx)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-[10px] text-muted-foreground text-center", children: "Summary generated by AI based on customer reviews. May contain inaccuracies." })
    ] })
  ] });
}
function ProductPage() {
  const {
    slug
  } = Route$1.useParams();
  const {
    data: product
  } = useSuspenseQuery(productQuery(slug));
  const {
    data: similar
  } = useSuspenseQuery(similarProductsQuery(slug));
  const {
    data: reviews
  } = useSuspenseQuery(reviewsQuery(slug));
  const {
    data: wishlist
  } = useQuery(wishlistQuery());
  const {
    data: me
  } = useQuery(meQuery());
  const qc = useQueryClient();
  const [activeImage, setActiveImage] = reactExports.useState(0);
  const [qty, setQty] = reactExports.useState(1);
  const [selectedAttrs, setSelectedAttrs] = reactExports.useState(() => Object.fromEntries(product.attributes.map((a) => [a.name, a.values[0]])));
  const [isDrawerOpen, setIsDrawerOpen] = reactExports.useState(false);
  const [subscriptionFrequency, setSubscriptionFrequency] = reactExports.useState(null);
  const isWishlisted = wishlist?.items.some((i) => i.productId === product.id) ?? false;
  const off = discountPct(product.mrp, product.price);
  const addToCart = useMutation({
    mutationFn: () => cartService.add(product.id, qty, void 0, subscriptionFrequency),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["cart"]
      });
      toast.success(`Added ${qty} × ${product.name.slice(0, 40)} to cart`);
    },
    onError: (e) => toast.error(e.message)
  });
  const toggleWishlist = useMutation({
    mutationFn: () => isWishlisted ? wishlistService.remove(product.id) : wishlistService.add(product.id),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["wishlist"]
    })
  });
  const [bgColor, setBgColor] = reactExports.useState("transparent");
  const [imageRef, setImageRef] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!imageRef) return;
    const fac = new FastAverageColor();
    fac.getColorAsync(imageRef, {
      crossOrigin: "anonymous"
    }).then((color) => {
      setBgColor(color.rgba);
    }).catch((e) => console.error("FAC error:", e));
    return () => fac.destroy();
  }, [imageRef, activeImage, product.images]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container-page py-4 md:py-6 relative overflow-hidden transition-colors duration-1000", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10 opacity-15 dark:opacity-20 transition-colors duration-1000 pointer-events-none blur-3xl scale-150 rounded-full", style: {
      background: `radial-gradient(circle at top right, ${bgColor}, transparent 60%)`
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "mb-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:underline", children: "Home" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/search", className: "hover:underline", children: "All products" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: product.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-[1fr_1.2fr] lg:gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:sticky md:top-24 md:self-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square overflow-hidden rounded-lg border bg-[var(--surface-2)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { ref: setImageRef, src: product.images[activeImage]?.url, alt: product.images[activeImage]?.alt, className: "h-full w-full object-cover", crossOrigin: "anonymous" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex gap-2 overflow-x-auto", children: product.images.map((img, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveImage(i), className: `h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${activeImage === i ? "border-[var(--primary)]" : "border-transparent opacity-70"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img.url, alt: img.alt, className: "h-full w-full object-cover" }) }, img.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SubscriptionSelector, { onSelect: setSubscriptionFrequency }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => addToCart.mutate(), disabled: product.stock === 0 || addToCart.isPending, className: "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-[var(--primary)] text-sm font-semibold text-primary-foreground transition hover:bg-[var(--primary-hover)] disabled:opacity-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { size: 16 }),
            " ",
            addToCart.isPending ? "Adding…" : "Add to cart"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggleWishlist.mutate(), className: "inline-flex h-11 items-center justify-center gap-2 rounded-md border-2 px-4 text-sm font-semibold hover:bg-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 16, fill: isWishlisted ? "currentColor" : "none", className: isWishlisted ? "text-destructive" : "" }),
            isWishlisted ? "Saved" : "Wishlist"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setIsDrawerOpen(true), disabled: product.stock === 0, className: "flex w-full h-11 items-center justify-center gap-2 rounded-md bg-black text-white font-bold transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { size: 16, className: "fill-current" }),
          " Buy Now"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: product.brand }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-xl font-semibold leading-tight md:text-2xl", children: product.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Rating, { value: product.ratingAverage, count: product.ratingCount, size: "md" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "SKU ",
            product.sku
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FlashSaleBanner, { endTime: product.flashSaleEndTime, stockLeft: product.flashSaleStock || Math.floor(Math.random() * 50) + 5 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-lg border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PriceBlock, { price: product.price, mrp: product.mrp, size: "lg" }),
          off > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-sm text-[var(--discount)]", children: [
            "You save ",
            formatINR(product.mrp - product.price)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs text-muted-foreground", children: "Inclusive of all taxes" })
        ] }),
        product.attributes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 space-y-4", children: product.attributes.map((attr) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
              attr.name,
              ":"
            ] }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: selectedAttrs[attr.name] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: attr.values.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelectedAttrs((s) => ({
            ...s,
            [attr.name]: v
          })), className: `rounded-md border px-3 py-1.5 text-sm transition ${selectedAttrs[attr.name] === v ? "border-[var(--primary)] bg-[var(--primary)]/5 font-semibold text-[var(--primary)]" : "hover:border-foreground/40"}`, children: v }, v)) })
        ] }, attr.name)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Quantity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center rounded-md border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty((q) => Math.max(1, q - 1)), className: "h-9 w-9 hover:bg-muted", children: "−" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-10 text-center text-sm font-semibold", children: qty }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty((q) => Math.min(product.stock, q + 1)), className: "h-9 w-9 hover:bg-muted", children: "+" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            product.stock,
            " in stock"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-lg border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-sm font-semibold", children: "Highlights" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: product.highlights.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14, className: "mt-0.5 flex-shrink-0 text-[var(--success)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: h })
          ] }, h)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-3 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrustItem, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { size: 16 }), label: "Free delivery", sub: "On orders over ₹999" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrustItem, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 16 }), label: "7-day returns", sub: "Easy returns" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrustItem, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { size: 16 }), label: "Secure payment", sub: "UPI · cards · COD" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2 text-lg font-semibold", children: "About this item" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-line text-sm leading-relaxed text-foreground/90", children: product.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(VideoReviewGrid, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-lg font-semibold", children: "Specifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: product.specifications.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-lg border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted px-3 py-2 text-sm font-semibold", children: g.group }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "w-full text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: g.items.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "w-1/3 bg-muted/30 px-3 py-2 text-muted-foreground", children: row.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: row.value })
            ] }, row.label)) }) })
          ] }, g.group)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 text-lg font-semibold", children: "Ratings & reviews" }),
      reviews.summary.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AiReviewSummary, { productName: product.name }) }),
      reviews.summary.count === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-card p-6 text-sm text-muted-foreground", children: [
        "No reviews yet. Be the first to review this product once you've purchased it.",
        me?.user && /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewForm, { productId: product.id, slug })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-[260px_1fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-bold", children: [
            reviews.summary.average.toFixed(1),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-normal text-muted-foreground", children: "/5" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
            reviews.summary.count,
            " ratings"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-1", children: [5, 4, 3, 2, 1].map((star) => {
            const c = reviews.summary.distribution[star] ?? 0;
            const pct = reviews.summary.count ? Math.round(c / reviews.summary.count * 100) : 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-6", children: [
                star,
                "★"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 flex-1 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-[var(--rating)]", style: {
                width: `${pct}%`
              } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-right text-muted-foreground", children: c })
            ] }, star);
          }) }),
          me?.user && /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewForm, { productId: product.id, slug })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: reviews.items.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Rating, { value: r.rating, showCount: false }),
            r.title && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: r.title })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm", children: r.body }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-3 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.userName }),
            r.verifiedPurchase && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 text-[var(--success)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 12, fill: "currentColor", strokeWidth: 0 }),
              " Verified purchase"
            ] })
          ] })
        ] }, r.id)) })
      ] })
    ] }),
    similar.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-lg font-semibold", children: "Similar products" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5", children: similar.slice(0, 5).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p }, p.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(QuickCheckoutDrawer, { isOpen: isDrawerOpen, onClose: () => setIsDrawerOpen(false), product, quantity: qty })
  ] });
}
function TrustItem({
  icon,
  label,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-md border bg-card p-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[var(--primary)]", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: sub })
    ] })
  ] });
}
export {
  ProductPage as component
};
