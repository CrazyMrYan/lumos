"use client";

import React, { useEffect, useRef, useState } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";

interface EditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  previewTheme?: string;
}

export default function Editor({ initialValue = "# Hello Lumos", onChange, previewTheme = "light" }: EditorProps) {
  const [vditor, setVditor] = useState<Vditor>();
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (vditor) {
      // Direct DOM manipulation to switch theme CSS link if Vditor's method is flaky
      // Vditor creates a <link id="vditorContentTheme">. Let's try to update its href manually.
      const themeLink = document.getElementById("vditorContentTheme") as HTMLLinkElement;
      const themeUrl = `https://unpkg.com/vditor/dist/css/content-theme/${previewTheme}.css`;
      
      if (themeLink) {
        themeLink.href = themeUrl;
      } else {
        // If not found (initial load might be slow), fallback to API
        // But API might not trigger if value hasn't "changed" internally
        (vditor as any).setPreviewTheme?.(previewTheme, "https://unpkg.com/vditor/dist/css/content-theme");
      }
    }
  }, [previewTheme, vditor]);

  useEffect(() => {
    if (!editorRef.current) return;

    const vditorInstance = new Vditor(editorRef.current, {
      value: initialValue,
      mode: "ir", // Instant Rendering
      height: "100%",
      theme: "classic",
      cache: { enable: false },
      toolbar: [
        "headings",
        "bold",
        "italic",
        "strike",
        "link",
        "|",
        "list",
        "ordered-list",
        "check",
        "|",
        "quote",
        "line",
        "code",
        "inline-code",
        "|",
        "source", // Toggle source/wysiwyg
        "|",
        "undo",
        "redo",
      ],
      preview: {
        theme: {
          current: previewTheme,
          path: "https://unpkg.com/vditor/dist/css/content-theme",
        },
      },
      input: (value) => {
        onChange?.(value);
      },
    });

    setVditor(vditorInstance);

    return () => {
      // Vditor's destroy method might be buggy if called too early or if instance isn't fully ready
      // Safe check before destroying
      if (vditorInstance) {
        try {
          vditorInstance.destroy();
        } catch (e) {
          console.warn("Vditor destroy error:", e);
        }
      }
      setVditor(undefined);
    };
  }, []);

  return <div ref={editorRef} className="h-full w-full" />;
}
