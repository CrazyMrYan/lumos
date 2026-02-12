"use client";

import React, { useEffect, useRef } from "react";
import Reveal from "reveal.js";
import Markdown from "reveal.js/plugin/markdown/markdown";
import Highlight from "reveal.js/plugin/highlight/highlight";
import Notes from "reveal.js/plugin/notes/notes";
import "reveal.js/dist/reveal.css";
// Remove static theme import, handled dynamically
import "reveal.js/plugin/highlight/monokai.css";

interface SlidesViewProps {
  markdown: string;
  theme: string;
}

export default function SlidesView({ markdown, theme }: SlidesViewProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const revealInstance = useRef<Reveal.Api | null>(null);

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
    link.href = `https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/theme/${theme}.css`;
  }, [theme]);

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

  return (
    <div className="relative w-full h-full">
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
