"use client";

import React, { useEffect, useRef } from "react";
import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";
import { Toolbar } from "markmap-toolbar";
import "markmap-toolbar/dist/style.css";

const transformer = new Transformer();

interface MindMapProps {
  markdown: string;
  theme: string;
}

export default function MindMapView({ markdown, theme }: MindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const mmRef = useRef<Markmap>();
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Determine dark mode based on theme name (naive check for common dark themes)
  const isDark = ["black", "night", "blood", "league", "moon", "dracula"].includes(theme);
  
  // Dynamic styles for the container based on theme
  const containerStyle = isDark 
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

      // Apply theme options to markmap
      // Markmap doesn't support full themes like reveal, but we can tweak initial options or CSS
      // Re-create or update options if API allows, or rely on CSS variables inheritance
      // For now, svg color inheritance handles text color usually.
      
      mmRef.current.setData(root);
      mmRef.current.fit();
    }
  }, [markdown]);

  return (
    <div 
      className="relative w-full h-full flex flex-col rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-colors duration-300"
      style={containerStyle}
    >
      <div className="absolute bottom-4 right-4 z-10" ref={toolbarRef} />
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
