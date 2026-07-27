import React, { useState, useEffect } from "react";

const HERO_IMAGES = [
  "https://res.cloudinary.com/ddc26noa/image/upload/v1784818378/253483203_1784817786561488_xjv8xj.jpg",
  "https://res.cloudinary.com/ddc26noa/image/upload/v1784819072/81306860_1784818991831817_ijlkwa.jpg"
];

export function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000); // Auto slide every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-48 sm:h-64 md:h-72 lg:h-80 rounded-2xl overflow-hidden border border-slate-200/80 shadow-md relative bg-slate-900 group">
      {HERO_IMAGES.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`TANITA Hero Banner ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          referrerPolicy="no-referrer"
        />
      ))}

      {/* Slide Navigation Indicators */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2 z-10">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex 
                ? "w-8 bg-[#154734] shadow-sm" 
                : "w-2.5 bg-white/60 hover:bg-white"
            }`}
            aria-label={`Ke slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Prev / Next Buttons on Hover */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? HERO_IMAGES.length - 1 : prev - 1))}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/40 hover:bg-slate-950/80 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer backdrop-blur-xs"
        aria-label="Banner sebelumnya"
      >
        <span className="material-symbols-outlined text-lg">chevron_left</span>
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/40 hover:bg-slate-950/80 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer backdrop-blur-xs"
        aria-label="Banner berikutnya"
      >
        <span className="material-symbols-outlined text-lg">chevron_right</span>
      </button>
    </div>
  );
}


