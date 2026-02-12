"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PanelLeft, Monitor, Presentation, Network } from "lucide-react";

// Dynamically import Vditor to avoid SSR issues
const Editor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center text-gray-400">Loading Editor...</div>,
});

const MindMapView = dynamic(() => import("@/components/MindMapView"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center text-gray-400">Loading Mind Map...</div>,
});

export default function Home() {
  const [content, setContent] = useState<string>("# Welcome to Lumos 🪄\n\n## Core Philosophy\n\n- **Single Source of Truth**\n- **AI-Powered**\n- **Client-First**\n\n## Tech Stack\n\n- Editor: Vditor\n- Slides: Reveal.js\n- Mind Map: Markmap");
  const [activeView, setActiveView] = useState<"slides" | "mindmap" | "site">("mindmap");

  return (
    <main className="flex h-screen w-full">
      {/* Sidebar / Editor Area */}
      <div className="w-1/2 h-full border-r border-gray-200 flex flex-col">
        <div className="h-12 border-b border-gray-200 flex items-center px-4 justify-between bg-white">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <PanelLeft className="w-5 h-5" />
            <span>Editor</span>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <Editor initialValue={content} onChange={setContent} />
        </div>
      </div>

      {/* Preview Area */}
      <div className="w-1/2 h-full flex flex-col bg-gray-50">
        <div className="h-12 border-b border-gray-200 flex items-center px-2 bg-white">
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setActiveView("mindmap")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeView === "mindmap" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Network className="w-4 h-4" />
              Mind Map
            </button>
            <button
              onClick={() => setActiveView("slides")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeView === "slides" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Presentation className="w-4 h-4" />
              Slides
            </button>
            <button
              onClick={() => setActiveView("site")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeView === "site" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Monitor className="w-4 h-4" />
              Website
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-hidden relative">
          {activeView === "mindmap" && <MindMapView markdown={content} />}
          
          {activeView === "slides" && (
            <div className="h-full w-full bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center">
              <p className="text-gray-400">Slides View (Coming Soon)</p>
            </div>
          )}

          {activeView === "site" && (
            <div className="h-full w-full bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center">
              <p className="text-gray-400">Static Site View (Coming Soon)</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
