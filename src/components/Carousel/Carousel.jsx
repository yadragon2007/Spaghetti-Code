import { useRef, useState } from "react";
import ModelViewer from "../ModelViewer/ModelViewer";

export default function Carousel({ items }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const handleScroll = () => {
    const el = trackRef.current;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (i) => {
    const el = trackRef.current;
    const index = Math.max(0, Math.min(items.length - 1, i));
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      {/* track */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex mt-0 w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div key={item.id} className="w-full shrink-0 snap-center">
            <div className="text-center text-white">
              <ModelViewer
                src={item.Model}
                width="100%"
                height={250}
                rotate={false}
                elevation={25}
                azimuth={40}
                headLight={3}
                studio={1.5}
              />
              <h3 className="-mt-2 text-xl font-semibold">{item.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* arrows */}
      <button
        onClick={() => goTo(active - 1)}
        disabled={active === 0}
        aria-label="Previous"
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-transparent! p-2 text-3xl text-white/70 transition hover:text-white disabled:opacity-30"
      >
        ‹
      </button>
      <button
        onClick={() => goTo(active + 1)}
        disabled={active === items.length - 1}
        aria-label="Next"
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent! p-2 text-3xl text-white/70 transition hover:text-white disabled:opacity-30"
      >
        ›
      </button>
    </div>
  );
}
