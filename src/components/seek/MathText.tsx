"use client";

import { useEffect, useRef } from "react";

interface MathTextProps {
  text: string;
  style?: React.CSSProperties;
}

export function MathText({ text, style }: MathTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Check if KaTeX is available
    const renderMath = () => {
      if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).katex) {
        const katex = (window as unknown as Record<string, { renderToString: (tex: string, opts: Record<string, unknown>) => string }>).katex;
        const el = ref.current;
        if (!el) return;

        // Replace LaTeX delimiters with rendered math
        let html = el.innerHTML;

        // Replace \\(...\\) inline math
        html = html.replace(/\\\((.+?)\\\)/g, (_, tex) => {
          try { return katex.renderToString(tex, { throwOnError: false }); } catch { return tex; }
        });

        // Replace \\[...\\] display math
        html = html.replace(/\\\[(.+?)\\\]/g, (_, tex) => {
          try { return katex.renderToString(tex, { throwOnError: false, displayMode: true }); } catch { return tex; }
        });

        // Replace $$...$$ display math first
        html = html.replace(/\$\$(.+?)\$\$/g, (_, tex) => {
          try { return katex.renderToString(tex, { throwOnError: false, displayMode: true }); } catch { return tex; }
        });

        el.innerHTML = html;
      }
    };

    // Load KaTeX script if not present
    if (!(window as unknown as Record<string, unknown>).katex) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js";
      script.crossOrigin = "anonymous";
      script.onload = renderMath;
      document.head.appendChild(script);
    } else {
      renderMath();
    }
  }, [text]);

  // Clean up common LaTeX display issues for plain text fallback
  const cleanText = text
    .replace(/\\rightarrow/g, " → ")
    .replace(/\\leftarrow/g, " ← ")
    .replace(/\\leq/g, " ≤ ")
    .replace(/\\geq/g, " ≥ ")
    .replace(/\\neq/g, " ≠ ")
    .replace(/\\times/g, " × ")
    .replace(/\\div/g, " ÷ ")
    .replace(/\\infty/g, "∞")
    .replace(/\\in/g, " ∈ ")
    .replace(/\\subset/g, " ⊂ ")
    .replace(/\\cup/g, " ∪ ")
    .replace(/\\cap/g, " ∩ ")
    .replace(/\\lbrace/g, "{")
    .replace(/\\rbrace/g, "}")
    .replace(/\\mathbb\{R\}/g, "ℝ")
    .replace(/\\mathbb\{Z\}/g, "ℤ")
    .replace(/\\mathbb\{N\}/g, "ℕ")
    .replace(/\\begin\{aligned\}/g, "")
    .replace(/\\end\{aligned\}/g, "")
    .replace(/\\begin\{pmatrix\}/g, "[")
    .replace(/\\end\{pmatrix\}/g, "]")
    .replace(/\\begin\{bmatrix\}/g, "[")
    .replace(/\\end\{bmatrix\}/g, "]")
    .replace(/\\\\/g, "\n")
    .replace(/\\quad/g, "  ")
    .replace(/\\text\{([^}]*)\}/g, "$1")
    .replace(/\\mid/g, " | ")
    .replace(/&/g, "  ");

  return (
    <div ref={ref} style={{ whiteSpace: "pre-wrap", ...style }}>
      {cleanText}
    </div>
  );
}
