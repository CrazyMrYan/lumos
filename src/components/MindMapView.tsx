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
  theme: string;
}

export default function MindMapView({ markdown, theme }: MindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const mmRef = useRef<Markmap>();
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Determine dark mode based on theme name
  // Explicitly list LIGHT themes. Everything else defaults to dark or we check explicitly.
  const isLight = ["white", "beige", "sky", "serif", "simple", "solarized"].includes(theme);
  
  // Dynamic styles for the container based on theme
  const containerStyle = !isLight 
    ? { backgroundColor: "#1e1e1e", color: "#f8f8f2" } 
    : { backgroundColor: "#ffffff", color: "#333333" };

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
      
      const walk = (node: any, depth = 0) => {
        if (depth > 1) {
          node.p = { ...node.p, f: true };
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
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Lumos Mindmap</title>
<style>
svg { width: 100vw; height: 100vh; background-color: ${!isLight ? "#1e1e1e" : "#ffffff"}; }
body { margin: 0; padding: 0; overflow: hidden; }
.markmap-node { color: ${!isLight ? "#f8f8f2" : "#333333"}; }
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
    <div 
      className="relative w-full h-full flex flex-col rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-colors duration-300"
      style={containerStyle}
    >
      <div className="absolute top-4 right-4 z-20">
         <button 
          onClick={handleExport}
          className="bg-white/90 backdrop-blur p-2 rounded-lg shadow border border-gray-200 text-gray-700 hover:text-blue-600 transition-colors"
          title="Export HTML"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
      <div className="absolute bottom-4 right-4 z-10" ref={toolbarRef} />
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
