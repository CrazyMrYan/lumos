"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface WebsiteViewProps {
  markdown: string;
}

export default function WebsiteView({ markdown }: WebsiteViewProps) {
  // Extract the first H1 heading for the site title
  const titleMatch = markdown.match(/^# (.*$)/m);
  const title = titleMatch ? titleMatch[1] : "Lumos Site";

  // Remove the first H1 from content to avoid duplication if we use it as a header
  // const contentWithoutTitle = markdown.replace(/^# .*$/m, "");

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto">
      {/* Mock Browser Chrome */}
      <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 bg-white h-7 rounded-md border border-gray-300 flex items-center justify-center text-xs text-gray-500 font-mono">
          lumos.site/{title.toLowerCase().replace(/\s+/g, "-")}
        </div>
      </div>

      {/* Website Content */}
      <article className="max-w-3xl mx-auto px-8 py-12 prose prose-slate prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:underline">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </article>
      
      {/* Simple Footer */}
      <footer className="border-t border-gray-100 mt-12 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} {title}. Built with Lumos.
      </footer>
    </div>
  );
}
