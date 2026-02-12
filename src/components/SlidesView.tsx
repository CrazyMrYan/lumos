"use client";

import React, { useEffect, useRef } from "react";
import Reveal from "reveal.js";
import Markdown from "reveal.js/plugin/markdown/markdown";
import Highlight from "reveal.js/plugin/highlight/highlight";
import Notes from "reveal.js/plugin/notes/notes";
import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/white.css";
import "reveal.js/plugin/highlight/monokai.css";

interface SlidesViewProps {
  markdown: string;
}

export default function SlidesView({ markdown }: SlidesViewProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const revealInstance = useRef<Reveal.Api | null>(null);

  useEffect(() => {
    if (!deckRef.current) return;

    // Destroy previous instance if it exists to prevent memory leaks/glitches
    if (revealInstance.current) {
      revealInstance.current.destroy();
    }

    // Initialize Reveal
    const deck = new Reveal(deckRef.current, {
      plugins: [Markdown, Highlight, Notes],
      embedded: true, // Crucial for embedding in a div
      hash: false,
      keyboard: true, // Enable keyboard navigation
      mouseWheel: false,
      transition: "slide",
      backgroundTransition: "fade",
    });

    deck.initialize().then(() => {
      revealInstance.current = deck;
    });

    return () => {
      if (revealInstance.current) {
        try {
          revealInstance.current.destroy();
        } catch (e) {
          // Ignore destroy errors
        }
      }
    };
  }, []); // Only re-init when mounting

  // Update content dynamically
  useEffect(() => {
    if (revealInstance.current && deckRef.current) {
      // Reveal.js markdown plugin expects raw markdown in a script tag or section
      // But for dynamic updates, we might need to manually sync or re-render
      // For MVP, we will rely on re-mounting or syncing the DOM structure
      
      // Simple hack: direct DOM manipulation for instant feedback if possible
      // But Reveal needs re-layout.
      
      const slidesContainer = deckRef.current.querySelector(".slides");
      if (slidesContainer) {
        // Convert simple markdown split by '---' to sections
        // This is a naive client-side transformer. 
        // Real implementation would use a proper markdown parser.
        
        const sections = markdown.split(/\n---\n/).map(slideMd => {
            return `<section data-markdown><textarea data-template>${slideMd}</textarea></section>`;
        }).join("");
        
        slidesContainer.innerHTML = sections;
        
        // Sync and layout
        revealInstance.current.sync();
        revealInstance.current.layout();
        
        // Re-run markdown plugin parsing (tricky in runtime)
        // For smoother MVP, we might force a re-init if content changes drastically
        // Or better: use the markdown plugin's API if exposed.
        
        // Actually, the most robust way for React + Reveal dynamic content 
        // is to destroy and re-create, or use key-based remounting.
      }
    }
  }, [markdown]);

  return (
    <div className="reveal w-full h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" ref={deckRef}>
      <div className="slides">
        <section data-markdown>
          <textarea data-template>{markdown}</textarea>
        </section>
      </div>
    </div>
  );
}
