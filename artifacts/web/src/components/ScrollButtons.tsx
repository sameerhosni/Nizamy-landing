import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function ScrollButtons() {
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setShowUp(y > 400);
      setShowDown(y < max - 200);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  return (
    <div className="fixed bottom-24 start-5 z-40 flex flex-col gap-2.5">
      <AnimatePresence>
        {showUp && (
          <motion.button
            key="up"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="w-12 h-12 rounded-full bg-white text-slate-700 border border-slate-200 shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:bg-blue-600 hover:text-white hover:border-blue-600 flex items-center justify-center transition-colors"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showDown && (
          <motion.button
            key="down"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
            className="w-12 h-12 rounded-full bg-white text-slate-700 border border-slate-200 shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:bg-blue-600 hover:text-white hover:border-blue-600 flex items-center justify-center transition-colors"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
