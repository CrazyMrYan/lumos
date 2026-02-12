"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PanelLeft, Monitor, Presentation, Network, Download, PanelRightClose, PanelRightOpen, Settings } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center text-gray-400">Loading Editor...</div>,
});

const MindMapView = dynamic(() => import("@/components/MindMapView"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center text-gray-400">Loading Mind Map...</div>,
});

const SlidesView = dynamic(() => import("@/components/SlidesView"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center text-gray-400">Loading Slides...</div>,
});

const THEMES = [
  "dracula", "black", "white", "league", "beige", "sky", 
  "night", "serif", "simple", "solarized", "blood", "moon"
];

export default function Home() {
  const [content, setContent] = useLocalStorage<string>("lumos-content", "# Welcome to Lumos 🪄\n\n## Core Philosophy\n\n- **Single Source of Truth**\n- **AI-Powered**\n- **Client-First**\n\n---\n\n## Tech Stack\n\n- Editor: Vditor\n- Slides: Reveal.js\n- Mind Map: Markmap");
  const [activeView, setActiveView] = useLocalStorage<"slides" | "mindmap">("lumos-view", "mindmap");
  const [theme, setTheme] = useLocalStorage<string>("lumos-theme", "dracula");
  const [showPreview, setShowPreview] = useLocalStorage<boolean>("lumos-preview-open", false);

  const handleExport = () => {
    if (activeView === "slides") {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Lumos Presentation</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reveal.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/theme/${theme}.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/plugin/highlight/monokai.css">
</head>
<body>
  <div class="reveal">
    <div class="slides">
      <section data-markdown>
        <textarea data-template>
${content}
        </textarea>
      </section>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/dist/reveal.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/plugin/markdown/markdown.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/reveal.js@5.0.4/plugin/highlight/highlight.js"></script>
  <script>
    Reveal.initialize({
      plugins: [ RevealMarkdown, RevealHighlight ],
      hash: true,
    });
  </script>
</body>
</html>`;
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "presentation.html";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Mindmap Export logic moved here or triggered via ref? 
      // For MVP simplicity, keep logic in MindMapView or use a context.
      // Since we lifted state, handleExport in parent is tricky for Child DOM access without ref forwarding.
      // Strategy: We will render the export button INSIDE the view component for now, 
      // OR pass a trigger prop. Let's keep specific export buttons inside views for DOM access, 
      // BUT for Slides it's pure data transform so it can be here. 
      // For Mindmap it needs SVG ref. 
      // Actually, let's keep the Export button in the Header for Slides, 
      // and let MindMap view handle its own export button internally if needed, 
      // OR we just use the header button to dispatch an event.
      // Let's stick to: Slides Export in Header (easy), Mindmap Export inside MindmapView (needs ref).
    }
  };

  return (
    <main className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Editor Area */}
      <div className={`h-full transition-all duration-300 ease-in-out flex flex-col border-r border-gray-200 ${showPreview ? 'w-1/2' : 'w-full'}`}>
        <div className="h-14 border-b border-gray-200 flex items-center px-4 justify-between bg-white shrink-0">
          <div className="flex items-center gap-2 text-gray-700 font-bold text-lg">
            <span className="text-xl">🪄</span>
            <span>Lumos</span>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${showPreview ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {showPreview ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            {showPreview ? "Close Preview" : "Open Preview"}
          </button>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <Editor initialValue={content} onChange={setContent} />
        </div>
      </div>

      {/* Preview Area */}
      {showPreview && (
        <div className="w-1/2 h-full flex flex-col bg-gray-50 transition-all duration-300 ease-in-out">
          {/* Preview Toolbar */}
          <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveView("mindmap")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeView === "mindmap" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                Mind Map
              </button>
              <button
                onClick={() => setActiveView("slides")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeView === "slides" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Presentation className="w-3.5 h-3.5" />
                Slides
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Selector */}
              <div className="flex items-center gap-2 bg-gray-50 px-2 py-1.5 rounded-md border border-gray-200">
                <Settings className="w-3.5 h-3.5 text-gray-400" />
                <select 
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-transparent text-xs font-medium text-gray-700 focus:outline-none cursor-pointer w-20"
                >
                  {THEMES.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Export Button (Slides only here, Mindmap has internal) */}
              {activeView === "slides" && (
                <button 
                  onClick={handleExport}
                  className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
                  title="Export HTML"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-hidden relative">
            {activeView === "mindmap" && <MindMapView markdown={content} theme={theme} />}
            {activeView === "slides" && <SlidesView key={`${content}-${theme}`} markdown={content} theme={theme} />}
          </div>
        </div>
      )}
    </main>
  );
}
