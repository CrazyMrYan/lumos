"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";
import { Toolbar } from "markmap-toolbar";
import "markmap-toolbar/dist/style.css";

const transformer = new Transformer();

export interface MindMapRef {
  exportSvg: () => void;
}

interface MindMapProps {
  markdown: string;
  darkMode?: boolean;
}

const MindMapView = forwardRef<MindMapRef, MindMapProps>(({ markdown, darkMode = false }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const mmRef = useRef<Markmap>();
  const toolbarRef = useRef<HTMLDivElement>(null);

  const containerStyle = {
    backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
    color: darkMode ? "#f8f8f2" : "#333333",
  };

  useImperativeHandle(ref, () => ({
    exportSvg: () => {
      // Export as independent HTML file
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Lumos Mindmap</title>
<style>
svg { width: 100vw; height: 100vh; background-color: ${darkMode ? "#1e1e1e" : "#ffffff"}; }
body { margin: 0; padding: 0; overflow: hidden; }
.markmap-node { color: ${darkMode ? "#f8f8f2" : "#333333"}; }
/* Add basic table styles for foreignObject rendering */
table { border-collapse: collapse; border: 1px solid currentColor; font-size: 0.8em; }
th, td { border: 1px solid currentColor; padding: 4px; }
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
</html>`;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mindmap.html";
      a.click();
      URL.revokeObjectURL(url);
    }
  }));

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

  useEffect(() => {
    if (svgRef.current) {
      // Force update SVG styles directly to ensure background color is applied
      svgRef.current.style.backgroundColor = darkMode ? "#1e1e1e" : "#ffffff";
      svgRef.current.style.color = darkMode ? "#f8f8f2" : "#333333";
    }
  }, [darkMode]);

  return (
    <div 
      className="relative w-full h-full flex flex-col rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-colors duration-300"
      style={containerStyle}
    >
      {/* Internal Toolbar for Zoom/Fit only */}
      <div className="absolute bottom-4 right-4 z-10" ref={toolbarRef} />
      
      {/* SVG Container */}
      <svg ref={svgRef} className="w-full h-full markmap-svg" />
      
      <style jsx global>{`
        .markmap-node { color: ${darkMode ? "#f8f8f2" : "#333333"}; }
        .markmap-link { stroke: ${darkMode ? "#666" : "#ccc"}; }
        /* Add table styles to internal view too */
        .markmap-foreign table { border-collapse: collapse; border: 1px solid currentColor; font-size: 0.8em; }
        .markmap-foreign th, .markmap-foreign td { border: 1px solid currentColor; padding: 4px; }
      `}</style>
    </div>
  );
});

MindMapView.displayName = "MindMapView";

export default MindMapView;
