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
      // Vditor doesn't expose setPreviewTheme directly in typing, but it's available on instance in some versions or via setTheme
      // However, for content theme, it's usually set via options.preview.theme.current
      // To dynamic update, we might need to destroy and recreate or use internal method if available.
      // Actually, Vditor has a method `setTheme` but that's for UI theme.
      // Content theme is dynamic. Let's try to update the DOM link directly if method is missing or re-init.
      // Re-init is safest for theme change.
      
      // But re-init is heavy. Let's check docs. setPreviewTheme IS a method in Vditor, but maybe typing is outdated.
      // Let's cast to any to bypass TS check if we are sure it exists, or handle it manually.
      (vditor as any).setPreviewTheme?.(previewTheme, "https://cdn.jsdelivr.net/npm/vditor/dist/css/content-theme");
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
          path: "https://cdn.jsdelivr.net/npm/vditor/dist/css/content-theme",
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
