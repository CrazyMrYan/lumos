"use client";

import React, { useEffect, useRef } from "react";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";
import { Toolbar } from "markmap-toolbar";
import "markmap-toolbar/dist/style.css";
import { Download } from "lucide-react";

const transformer = new Transformer();

interface MindMapProps {
  markdown: string;
}

export default function MindMapView({ markdown }: MindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const mmRef = useRef<Markmap>();
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (svgRef.current && !mmRef.current) {
      mmRef.current = Markmap.create(svgRef.current);
      if (toolbarRef.current) {
        const toolbar = Toolbar.create(mmRef.current);
        toolbar.setBrand(false);
        toolbarRef.current.append(toolbar.el);
      }
    }
  }, []);

  useEffect(() => {
    if (mmRef.current && markdown) {
      const { root } = transformer.transform(markdown);
      
      // Auto-fold nodes deeper than level 2
      const walk = (node: any, depth = 0) => {
        if (depth > 1) {
          node.p = { ...node.p, f: true }; // f = fold
        }
        if (node.c) {
          node.c.forEach((child: any) => walk(child, depth + 1));
        }
      };
      walk(root);

      mmRef.current.setData(root);
      mmRef.current.fit();
    }
  }, [markdown]);

  const handleExport = () => {
    // Export raw Markdown with specific Markmap frontmatter/format if needed, or just plain MD for now as it's the source of truth.
    // Standard mindmap formats (like FreeMind/XMind) require heavy XML conversion. 
    // Markmap's "native" format IS Markdown. So we export the markdown but with a specific extension/name.
    // Or we can export an HTML file that self-renders the mindmap (portable).
    
    // Let's do Portable HTML for now - most useful "mindmap format" for sharing.
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Lumos Mindmap</title>
<style>
svg { width: 100vw; height: 100vh; }
</style>
</head>
<body>
<svg id="mindmap"></svg>
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://cdn.jsdelivr.net/npm/markmap-view"></script>
<script src="https://cdn.jsdelivr.net/npm/markmap-lib"></script>
<script>
const { markmap } = window;
const { Transformer } = window.markmap;
const transformer = new Transformer();
const markdown = ${JSON.stringify(markdown)};
const { root } = transformer.transform(markdown);
markmap.Markmap.create('#mindmap', null, root);
</script>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mindmap.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
         <button 
          onClick={handleExport}
          className="bg-white/90 backdrop-blur p-2 rounded-lg shadow border border-gray-200 text-gray-700 hover:text-blue-600 transition-colors"
          title="Export SVG"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
      <div className="absolute bottom-4 right-4 z-10" ref={toolbarRef} />
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
