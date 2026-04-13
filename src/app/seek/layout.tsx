import { Roboto } from "next/font/google";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function SeekLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${roboto.variable} font-[family-name:var(--font-roboto)] min-h-screen bg-[#fafafa]`}>
      {/* KaTeX CSS for math rendering */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css" crossOrigin="anonymous" />
      {/* MathJax for SEEK question rendering */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-AMS-MML_HTMLorMML" async />
      {/* SEEK question CSS */}
      <style>{`
        .qt-hidden { /* visible in clone */ }
        .qt-question { margin-bottom: 24px; padding: 16px 0; border-bottom: 1px solid #e0e0e0; }
        .qt-question:last-child { border-bottom: none; }
        .qt-introduction { margin-bottom: 12px; font-size: 14px; line-height: 1.7; }
        .qt-points { float: right; font-size: 13px; color: rgba(0,0,0,0.54); font-weight: 500; }
        .qt-choices { list-style: none; padding: 0; margin: 8px 0; }
        .qt-choices li, .gcb-mcq-choice { padding: 8px 12px; margin: 4px 0; border: 1px solid rgba(0,0,0,0.12); border-radius: 4px; font-size: 14px; cursor: pointer; display: flex; align-items: flex-start; gap: 8px; }
        .qt-choices li:hover, .gcb-mcq-choice:hover { background: #f5f5f5; }
        .qt-mc-question { margin-bottom: 8px; }
        .qt-sa-question input { border: 1px solid rgba(0,0,0,0.12); border-radius: 4px; padding: 8px 12px; font-size: 14px; width: 200px; }
        .qt-response { margin-top: 8px; }
        .qt-feedback { /* visible in clone */ }
        .qt-grade-report { /* visible in clone */ }
        .qt-assessment-button-bar { margin-top: 16px; }
        .qt-check-answer-button, .qt-save-answer-button, .qt-grade-assessment, .qt-grade-scored-lesson {
          background: #7b1f1f; color: white; border: none; padding: 10px 24px; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; margin-right: 8px;
        }
        .qt-check-answer-button:hover, .qt-save-answer-button:hover { background: #5c1717; }
        .qt-warning { display: none; }
        .qt-question-group { margin-bottom: 16px; }
        .qt-embedded { margin: 8px 0; }
        .gcb-assessment-contents { font-size: 14px; line-height: 1.7; }
        .gcb-assessment-contents h1 { font-size: 20px; font-weight: 500; margin-bottom: 16px; }
        .gcb-assessment-body { padding: 0; }
        .gcb-question-row { margin-bottom: 16px; }
        .gcb-assessment-contents { counter-reset: qt-visible-counter; }
        .gcb-show-question-counter:before { content: counter(qt-visible-counter) ") "; counter-increment: qt-visible-counter; font-weight: 600; }
        .gcb-question-counter-increment { /* don't increment separately */ }
        .gcb-cols { display: flex; gap: 16px; }
        .gcb-col-counters { min-width: 30px; }
        .gcb-pull-right { float: right; }
        .gcb-button { background: #7b1f1f; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
        .assessment-top-info { margin-bottom: 16px; font-size: 13px; color: rgba(0,0,0,0.54); }
        .yui-img { max-width: 100%; height: auto; }
        table { border-collapse: collapse; margin: 8px 0; }
        table td, table th { border: 1px solid #ddd; padding: 6px 10px; font-size: 13px; }
        table th { background: #f5f5f5; font-weight: 600; }
        .gcb-code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-family: monospace; font-size: 13px; }
      `}</style>
      {children}
    </div>
  );
}
