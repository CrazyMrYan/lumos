"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Monitor, Presentation, Network, Download, PanelRightClose, PanelRightOpen, Settings, Moon, Sun } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { MindMapRef } from "@/components/MindMapView";

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
  const [content, setContent] = useLocalStorage<string>("lumos-content", `# 🪄 Welcome to Lumos
## The AI-Native Presentation Engine

> "One Source, Infinite Views."

---

## 🚀 Why Lumos?

- **Markdown Core**: Write once, render anywhere.
- **Instant Visualization**: Mind maps & Slides in real-time.
- **Local First**: Your data never leaves your browser.

---

## 💻 Code Highlighting

Lumos supports rich syntax highlighting for developers:

\`\`\`tsx
const Lumos = () => {
  return (
    <View>
      <MindMap />
      <Slides theme="dracula" />
    </View>
  );
};
\`\`\`

---

## 📊 Structured Data

| Feature | Support | Status |
|:---|:---:|:---|
| Live Preview | ✅ | Ready |
| HTML Export | ✅ | Ready |
| AI Generation | 🚧 | Coming Soon |

---

## 🎨 Theming System

Lumos comes with **10+ professional themes**:

1. **Dracula** (Default) 🧛
2. Black / White (Classic)
3. League (Modern)
4. Sky / Beige (Light)

*Check the top-right menu!*

---

## 🧠 Mind Mapping

Lumos isn't just for slides.
Switch to **Mind Map** view to see:

- Auto-folding branches
- Dark mode adaptation
- SVG export capabilities

---

## 📸 Rich Media

![Technology](https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80)

*Support for standard Markdown images.*

---

# 🏁 Ready to Start?

Just delete this text and **start typing**.`);
  const [activeView, setActiveView] = useLocalStorage<"slides" | "mindmap">("lumos-view", "slides");
  const [theme, setTheme] = useLocalStorage<string>("lumos-theme", "dracula");
  const [mindMapDark, setMindMapDark] = useLocalStorage<boolean>("lumos-mindmap-dark", false);
  const [showPreview, setShowPreview] = useLocalStorage<boolean>("lumos-preview-open", false);
  
  // Ref for MindMap export
  const mindMapRef = useRef<MindMapRef>(null);

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
      // Trigger MindMap export via ref
      // Since MindMapView is dynamic, we need to be careful. 
      // But DOM-based export in component is safer.
      // Wait, dynamic import might mess up ref forwarding if not handled.
      // For MVP robustness, let's try the direct ref call.
      if (mindMapRef.current) {
        mindMapRef.current.exportSvg();
      } else {
        // Fallback: Dispatch a custom event that MindMapView listens to?
        // Or simpler: grab the SVG from DOM directly here if ref fails.
        const svg = document.getElementById("lumos-mindmap-svg");
        if (svg) {
           // Reuse the export logic here if ref is null (safety net)
           const htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Lumos Mindmap</title><style>svg{width:100vw;height:100vh;background-color:${mindMapDark?"#1e1e1e":"#ffffff"};}body{margin:0;padding:0;overflow:hidden;}.markmap-node{color:${mindMapDark?"#f8f8f2":"#333333"};}table{border-collapse:collapse;border:1px solid currentColor;font-size:0.8em;}th,td{border:1px solid currentColor;padding:4px;}</style></head><body><svg id="mindmap"></svg><script src="https://cdn.jsdelivr.net/npm/d3@7"></script><script src="https://cdn.jsdelivr.net/npm/markmap-view"></script><script src="https://cdn.jsdelivr.net/npm/markmap-lib"></script><script>const {markmap}=window;const {Transformer}=window.markmap;const transformer=new Transformer();const markdown=${JSON.stringify(content)};const {root}=transformer.transform(markdown);markmap.Markmap.create('#mindmap',null,root);</script></body></html>`;
           const blob = new Blob([htmlContent], { type: "text/html" });
           const url = URL.createObjectURL(blob);
           const a = document.createElement("a");
           a.href = url;
           a.download = "mindmap.html";
           a.click();
           URL.revokeObjectURL(url);
        }
      }
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
                onClick={() => setActiveView("slides")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeView === "slides" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Presentation className="w-3.5 h-3.5" />
                Slides
              </button>
              <button
                onClick={() => setActiveView("mindmap")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeView === "mindmap" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                Mind Map
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Controls specific to view */}
              {activeView === "slides" ? (
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
              ) : (
                <button
                  onClick={() => setMindMapDark(!mindMapDark)}
                  className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors"
                  title={mindMapDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {mindMapDark ? <Sun className="w-3.5 h-3.5 text-yellow-500" /> : <Moon className="w-3.5 h-3.5 text-gray-500" />}
                  <span className="text-xs font-medium text-gray-700">{mindMapDark ? "Light" : "Dark"}</span>
                </button>
              )}

              {/* Shared Export Button */}
              <button 
                onClick={handleExport}
                className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
                title="Export HTML"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-hidden relative">
            {activeView === "mindmap" && (
              /* @ts-ignore - dynamic component ref typing is tricky, using DOM fallback mainly */
              <MindMapView ref={mindMapRef} markdown={content} darkMode={mindMapDark} />
            )}
            {activeView === "slides" && <SlidesView key={`${content}-${theme}`} markdown={content} theme={theme} />}
          </div>
        </div>
      )}
    </main>
  );
}
