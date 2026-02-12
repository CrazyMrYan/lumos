"use client";

import React, { useEffect, useRef, useState } from "react";
import Reveal from "reveal.js";
import Markdown from "reveal.js/plugin/markdown/markdown";
import Highlight from "reveal.js/plugin/highlight/highlight";
import Notes from "reveal.js/plugin/notes/notes";
import "reveal.js/dist/reveal.css";
// Remove static theme import
import "reveal.js/plugin/highlight/monokai.css";

interface SlidesViewProps {
  markdown: string;
}

const THEMES = [
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
  const [currentTheme, setCurrentTheme] = useState("black"); // Default theme

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
    
    // Dynamically load theme from node_modules path served by Next.js public or via CDN?
    // Since we can't easily serve node_modules assets in Next.js without config,
    // we will use a CDN for themes for the MVP to keep it lightweight.
    // Alternatively, we could import all CSS files and toggle, but that's heavy.
    // Using unpkg/jsdelivr is standard for Reveal themes if not bundled.
    link.href = `https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/theme/${currentTheme}.css`;
    
    return () => {
      // Don't remove link on unmount to prevent flash of unstyled content if re-mounting
    };
  }, [currentTheme]);

  useEffect(() => {
    if (!deckRef.current) return;

    // Cleanup previous instance
    if (revealInstance.current) {
      try {
        revealInstance.current.destroy();
        revealInstance.current = null;
      } catch (e) {
        console.warn("Reveal destroy error:", e);
      }
    }

    // Initialize Reveal with a small delay to ensure DOM is ready and prevent 'parentNode' errors
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
        // Disable scroll view for now as it causes errors in embedded mode
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

  // Update content
  useEffect(() => {
    // For MVP stability: we rely on the parent component key={content} to force re-mount
    // instead of trying to update Reveal.js in-place via DOM manipulation.
    // This is less efficient but 100% bug-free for sync errors.
  }, [markdown]);

  return (
    <div className="relative w-full h-full">
      {/* Theme Selector UI */}
      <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur p-2 rounded-lg shadow border border-gray-200 flex items-center gap-2">
        <label className="text-xs font-semibold text-gray-500 uppercase">Theme</label>
        <select 
          value={currentTheme}
          onChange={(e) => setCurrentTheme(e.target.value)}
          className="bg-transparent text-sm font-medium text-gray-800 focus:outline-none cursor-pointer"
        >
          {THEMES.map(theme => (
            <option key={theme} value={theme}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</option>
          ))}
        </select>
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
