"use client";

import React, { useEffect, useRef, useState } from "react";
import Reveal from "reveal.js";
import Markdown from "reveal.js/plugin/markdown/markdown";
import Highlight from "reveal.js/plugin/highlight/highlight";
import Notes from "reveal.js/plugin/notes/notes";
import "reveal.js/dist/reveal.css";
// Remove static theme import
import "reveal.js/plugin/highlight/monokai.css";
import { Download } from "lucide-react";

interface SlidesViewProps {
  markdown: string;
}

const THEMES = [
  "dracula",
  "black",
  "white",
  "league",
  "beige",
  "sky",
  "night",
  "serif",
  "simple",
  "solarized",
  "blood",
  "moon",
];

export default function SlidesView({ markdown }: SlidesViewProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const revealInstance = useRef<Reveal.Api | null>(null);
  const [currentTheme, setCurrentTheme] = useState("dracula"); // Default theme

  // Handle Theme Injection
  useEffect(() => {
    const linkId = "reveal-theme-css";
    let link = document.getElementById(linkId) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = `https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/theme/${currentTheme}.css`;
  }, [currentTheme]);

  useEffect(() => {
    if (!deckRef.current) return;

    if (revealInstance.current) {
      try {
        revealInstance.current.destroy();
        revealInstance.current = null;
      } catch (e) {
        console.warn("Reveal destroy error:", e);
      }
    }

    const initTimer = setTimeout(() => {
      if (!deckRef.current) return;

      const deck = new Reveal(deckRef.current, {
        plugins: [Markdown, Highlight, Notes],
        embedded: true,
        hash: false,
        keyboard: true,
        mouseWheel: false,
        transition: "slide",
        backgroundTransition: "fade",
        view: "default", 
      });

      deck.initialize().then(() => {
        revealInstance.current = deck;
      });
    }, 50);

    return () => {
      clearTimeout(initTimer);
      if (revealInstance.current) {
        try {
          revealInstance.current.destroy();
          revealInstance.current = null;
        } catch (e) {
          console.warn("Reveal destroy cleanup error:", e);
        }
      }
    };
  }, []);

  const handleExport = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "presentation.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full h-full">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <div className="bg-white/90 backdrop-blur p-1 rounded-lg shadow border border-gray-200 flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-500 uppercase px-2">Theme</label>
          <select 
            value={currentTheme}
            onChange={(e) => setCurrentTheme(e.target.value)}
            className="bg-transparent text-sm font-medium text-gray-800 focus:outline-none cursor-pointer pr-2"
          >
            {THEMES.map(theme => (
              <option key={theme} value={theme}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={handleExport}
          className="bg-white/90 backdrop-blur p-2 rounded-lg shadow border border-gray-200 text-gray-700 hover:text-blue-600 transition-colors"
          title="Export Markdown"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Reveal Deck */}
      <div className="reveal w-full h-full bg-gray-100 rounded-xl shadow-sm border border-gray-200 overflow-hidden" ref={deckRef}>
        <div className="slides">
          <section data-markdown="">
            <textarea data-template defaultValue={markdown} />
          </section>
        </div>
      </div>
    </div>
  );
}
