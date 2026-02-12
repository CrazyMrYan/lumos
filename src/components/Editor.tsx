"use client";

import React, { useEffect, useRef, useState } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";

interface EditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

export default function Editor({ initialValue = "# Hello Lumos", onChange }: EditorProps) {
  const [vditor, setVditor] = useState<Vditor>();
  const editorRef = useRef<HTMLDivElement>(null);

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
        "edit-mode", // Toggle source/wysiwyg
        "|",
        "undo",
        "redo",
      ],
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
