"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BookmarkButton } from "@/components/ui/BookmarkButton";

interface RawHtmlRendererProps {
  html: string;
  courseId?: string;
  assignmentId?: string;
}

interface BookmarkSlot {
  node: HTMLElement;
  questionId: string;
}

export function RawHtmlRenderer({ html, courseId, assignmentId }: RawHtmlRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [slots, setSlots] = useState<BookmarkSlot[]>([]);

  useEffect(() => {
    if (!containerRef.current || !html) return;

    // Inject HTML
    containerRef.current.innerHTML = html;

    // Load MathJax for math rendering
    function typesetMath() {
      const mj = (window as unknown as Record<string, unknown>).MathJax as {
        Hub?: { Queue: (args: unknown[]) => void };
      } | undefined;
      if (mj?.Hub && containerRef.current) {
        mj.Hub.Queue(["Typeset", mj.Hub, containerRef.current]);
      }
    }

    if ((window as unknown as Record<string, unknown>).MathJax) {
      typesetMath();
    } else {
      // Config
      const configScript = document.createElement("script");
      configScript.type = "text/x-mathjax-config";
      configScript.textContent = `MathJax.Hub.Config({tex2jax:{inlineMath:[['\\\\(','\\\\)'],['$','$']],displayMath:[['\\\\[','\\\\]'],['$$','$$']],processEscapes:true},TeX:{extensions:["AMSmath.js","AMSsymbols.js"]},messageStyle:"none"});`;
      document.head.appendChild(configScript);

      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
      script.async = true;
      script.onload = () => setTimeout(typesetMath, 200);
      document.head.appendChild(script);
    }

    // Hide SEEK's built-in feedback/grading that was captured in the HTML
    hideCapturedFeedback(containerRef.current);

    // Inject our own Check Answers functionality
    injectCheckAnswers(containerRef.current);

    // Inject bookmark slots into each question
    if (courseId && assignmentId) {
      const newSlots = injectBookmarkSlots(containerRef.current, courseId, assignmentId);
      setSlots(newSlots);
    } else {
      setSlots([]);
    }

    // If URL has #<rawQuestionId>, scroll to and briefly highlight that question.
    const rawHash = typeof window !== "undefined" ? decodeURIComponent(window.location.hash.slice(1)) : "";
    if (rawHash && containerRef.current) {
      setTimeout(() => {
        if (!containerRef.current) return;
        const escaped = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(rawHash) : rawHash;
        const target = containerRef.current.querySelector<HTMLElement>(
          `.qt-mc-question[id="${escaped}"], .qt-sa-question[id="${escaped}"]`
        );
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          const prevBg = target.style.background;
          const prevTransition = target.style.transition;
          target.style.transition = "background 0.8s ease";
          target.style.background = "#fff7d6";
          setTimeout(() => {
            target.style.background = prevBg;
            target.style.transition = prevTransition;
          }, 2500);
        }
      }, 300);
    }

  }, [html, courseId, assignmentId]);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          background: "#fff",
          borderRadius: 4,
          padding: 24,
          boxShadow: "0px 2px 1px -1px rgba(0,0,0,.2), 0px 1px 1px 0px rgba(0,0,0,.14), 0px 1px 3px 0px rgba(0,0,0,.12)",
          fontSize: 14,
          lineHeight: 1.7,
          color: "rgba(0,0,0,0.87)",
        }}
      />
      {courseId && assignmentId &&
        slots.map((slot) =>
          createPortal(
            <BookmarkButton
              courseId={courseId}
              assignmentId={assignmentId}
              questionId={slot.questionId}
            />,
            slot.node,
            slot.questionId
          )
        )}
    </>
  );
}

function injectBookmarkSlots(
  container: HTMLElement,
  courseId: string,
  assignmentId: string
): BookmarkSlot[] {
  const slots: BookmarkSlot[] = [];
  const seen = new Set<string>();

  const questionEls = container.querySelectorAll<HTMLElement>(
    ".qt-mc-question[id], .qt-sa-question[id]"
  );
  questionEls.forEach((qEl) => {
    const rawId = qEl.id;
    if (!rawId) return;
    const questionId = `${courseId}:${assignmentId}:${rawId}`;
    if (seen.has(questionId)) return;
    seen.add(questionId);

    const slot = document.createElement("span");
    slot.className = "bookmark-slot";
    slot.style.cssText =
      "display:inline-flex;float:right;margin-left:8px;align-items:center;";
    qEl.insertBefore(slot, qEl.firstChild);
    slots.push({ node: slot, questionId });
  });

  return slots;
}

function hideCapturedFeedback(container: HTMLElement) {
  // Hide SEEK's own feedback that was visible when page was captured
  container.querySelectorAll(".qt-feedback").forEach(el => {
    (el as HTMLElement).style.display = "none";
  });
  container.querySelectorAll(".qt-grade-report").forEach(el => {
    (el as HTMLElement).style.display = "none";
  });
  // Hide any element containing answer hints like "Hence Option X is correct/not correct"
  container.querySelectorAll("div, p, span, b, strong, em").forEach(el => {
    const t = (el as HTMLElement).innerText || "";
    if (t.match(/Hence\s+Option\s+\d+/i) ||
        t.match(/option\s+\d+\s+is\s+(not\s+)?correct/i) ||
        t.includes("This will help you") ||
        t.includes("Correct answer") ||
        t.includes("Your score")) {
      (el as HTMLElement).style.display = "none";
    }
  });
  // Hide any elements that show "Correct", "Incorrect", "Partially Correct", "Score", "Accepted Answers"
  container.querySelectorAll(".qt-correct, .qt-incorrect, .qt-partially-correct").forEach(el => {
    (el as HTMLElement).style.display = "none";
  });
  // Hide captured answer highlights (green/red backgrounds on options)
  container.querySelectorAll("[style*='background-color: rgb(144, 238']," +
    "[style*='background-color: rgb(255, 204']," +
    "[style*='background: rgb(144, 238']," +
    "[style*='background: rgb(255, 204']," +
    "[style*='border-color: green']," +
    "[style*='border-color: red']").forEach(el => {
    (el as HTMLElement).style.removeProperty("background-color");
    (el as HTMLElement).style.removeProperty("background");
    (el as HTMLElement).style.removeProperty("border-color");
  });
  // Uncheck pre-selected inputs BUT keep them interactive
  // Use setTimeout to do this after React render cycle
  setTimeout(() => {
    container.querySelectorAll("input[type='radio'], input[type='checkbox']").forEach(el => {
      const input = el as HTMLInputElement;
      input.checked = false;
      // Make sure inputs are not disabled
      input.disabled = false;
      input.removeAttribute("disabled");
    });
    container.querySelectorAll("input[type='text'], input[type='number']").forEach(el => {
      const input = el as HTMLInputElement;
      input.value = "";
      input.disabled = false;
      input.readOnly = false;
      input.removeAttribute("disabled");
      input.removeAttribute("readonly");
    });
  }, 100);
  // Remove any inline "Yes, the answer is correct" / "Partially Correct" / "Score:" text nodes
  // These are often in divs with specific patterns
  container.querySelectorAll("div, p, span").forEach(el => {
    const text = (el as HTMLElement).textContent || "";
    if ((text.includes("Yes, the answer is correct") ||
         text.includes("Partially Correct") ||
         text.includes("Accepted Answers:") ||
         text.match(/^Hence Option \d+/) ||
         text.includes("Hence Option") ||
         text.includes("is not correct") ||
         text.includes("is correct.") ||
         text.includes("This will help") ||
         text.match(/^Score:\s*[\d.]+$/)) &&
        !el.classList.contains("qt-question") &&
        !el.classList.contains("qt-introduction") &&
        !el.classList.contains("qt-mc-question") &&
        el.children.length === 0) {
      (el as HTMLElement).style.display = "none";
    }
  });
}

function injectCheckAnswers(container: HTMLElement) {
  // Parse all questionData from the HTML
  const answers: Record<string, { correct: string[]; type: string }> = {};

  // Find all script-like questionData in the HTML text
  const scripts = container.querySelectorAll("script");
  scripts.forEach((script) => {
    const text = script.textContent || "";
    // Match questionData assignments with base64
    const regex = /questionData\['([^']+)'\]\s*=\s*JSON\.parse\(window\.atob\("([^"]+)"\)\)/g;
    let m;
    while ((m = regex.exec(text)) !== null) {
      try {
        const decoded = JSON.parse(atob(m[2]));
        const id = m[1];

        if (decoded.choices && decoded.choices.length > 0) {
          const correct = decoded.choices
            .filter((c: { score?: number | string }) => parseFloat(String(c.score || 0)) > 0)
            .map((c: { text: string }) => c.text.replace(/<[^>]*>/g, "").trim());
          if (correct.length > 0) {
            answers[id] = { correct, type: correct.length > 1 ? "msq" : "mcq" };
          }
        }
        if (decoded.graders && decoded.graders.length > 0) {
          const correct = decoded.graders
            .filter((g: { score: string | number }) => parseFloat(String(g.score)) > 0)
            .map((g: { response: string }) => g.response);
          if (correct.length > 0) {
            answers[id] = { correct, type: "numerical" };
          }
        }

        // Batch format
        if (!decoded.choices && !decoded.graders) {
          Object.entries(decoded).forEach(([key, val]: [string, unknown]) => {
            const v = val as { choices?: { score?: number | string; text: string }[]; graders?: { score: string | number; response: string }[] };
            if (v?.choices) {
              const correct = v.choices.filter(c => parseFloat(String(c.score || 0)) > 0).map(c => c.text.replace(/<[^>]*>/g, "").trim());
              if (correct.length > 0) answers[key] = { correct, type: correct.length > 1 ? "msq" : "mcq" };
            }
            if (v?.graders) {
              const correct = v.graders.filter(g => parseFloat(String(g.score)) > 0).map(g => g.response);
              if (correct.length > 0) answers[key] = { correct, type: "numerical" };
            }
          });
        }
      } catch { /* skip */ }
    }
  });

  // Hide ALL existing SEEK buttons (we'll add our own)
  container.querySelectorAll(".qt-check-answer-button, .qt-save-answer-button, .qt-grade-assessment, .qt-grade-scored-lesson, .gcb-button, .qt-assessment-button-bar").forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });

  // Always add our own Check Answers button at the bottom
  const btnContainer = document.createElement("div");
  btnContainer.style.cssText = "margin:24px 0;padding:16px 0;border-top:1px solid rgba(0,0,0,0.12);display:flex;gap:12px;";

  const checkBtn = document.createElement("button");
  checkBtn.textContent = "Check Answers";
  checkBtn.style.cssText = "background:#7b1f1f;color:white;border:none;padding:10px 24px;border-radius:4px;font-size:14px;font-weight:500;cursor:pointer;";
  checkBtn.addEventListener("click", () => checkAllAnswers(container, answers));
  btnContainer.appendChild(checkBtn);

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save Answers";
  saveBtn.style.cssText = "background:white;color:#7b1f1f;border:1px solid #7b1f1f;padding:10px 24px;border-radius:4px;font-size:14px;font-weight:500;cursor:pointer;";
  btnContainer.appendChild(saveBtn);

  container.appendChild(btnContainer);
}

function checkAllAnswers(container: HTMLElement, answers: Record<string, { correct: string[]; type: string }>) {
  // Remove previous feedback
  container.querySelectorAll(".clone-feedback").forEach(el => el.remove());
  container.querySelectorAll(".clone-score-banner").forEach(el => el.remove());
  // Reset previous highlights
  container.querySelectorAll(".clone-correct, .clone-incorrect").forEach(el => {
    el.classList.remove("clone-correct", "clone-incorrect");
    (el as HTMLElement).style.removeProperty("background");
    (el as HTMLElement).style.removeProperty("border-color");
  });

  let totalScore = 0;
  let answeredPoints = 0;

  // Check each question
  container.querySelectorAll(".qt-mc-question, .qt-sa-question").forEach((qEl) => {
    const id = qEl.id || qEl.closest("[id]")?.id || "";

    // Find answer data — try exact match first, then partial
    let answerData = answers[id];
    if (!answerData) {
      for (const key of Object.keys(answers)) {
        if (id.includes(key) || key.includes(id)) { answerData = answers[key]; break; }
      }
    }

    // Get user's selected answers
    const userAnswer: string[] = [];
    qEl.querySelectorAll("input[type='radio']:checked, input[type='checkbox']:checked").forEach(input => {
      const label = input.closest("label, .gcb-mcq-choice, li");
      if (label) userAnswer.push(label.textContent?.trim() || "");
    });
    qEl.querySelectorAll("input[type='text'], input[type='number']").forEach(input => {
      const val = (input as HTMLInputElement).value.trim();
      if (val) userAnswer.push(val);
    });

    // Skip unanswered questions entirely
    if (userAnswer.length === 0) return;

    // Get point value
    const pointEl = qEl.closest(".qt-question")?.querySelector(".qt-points") ||
                    qEl.parentElement?.querySelector(".qt-points");
    const pointMatch = pointEl?.textContent?.match(/(\d+)\s*point/);
    const points = pointMatch ? parseInt(pointMatch[1]) : 1;
    answeredPoints += points;

    // Compare user answer with correct answer
    let isCorrect = false;
    if (answerData) {
      if (answerData.type === "numerical") {
        isCorrect = answerData.correct.some(c => c.toLowerCase().trim() === userAnswer[0].toLowerCase().trim());
      } else {
        // For MCQ/MSQ — check if user selected all correct options
        const correctSet = new Set(answerData.correct.map(c => c.toLowerCase().trim()));
        const userSet = new Set(userAnswer.map(u => {
          // Try to match by finding which correct answer is contained in user text
          for (const c of correctSet) {
            if (u.toLowerCase().includes(c) || c.includes(u.toLowerCase().trim())) return c;
          }
          return u.toLowerCase().trim();
        }));
        isCorrect = correctSet.size === userSet.size && [...correctSet].every(c => userSet.has(c));
      }
    }

    if (isCorrect) totalScore += points;

    // Highlight selected options
    qEl.querySelectorAll("input[type='radio']:checked, input[type='checkbox']:checked").forEach(input => {
      const label = input.closest("label, .gcb-mcq-choice, li") as HTMLElement;
      if (label) {
        label.style.background = isCorrect ? "#e8f5e9" : "#fef3f2";
        label.style.borderColor = isCorrect ? "#a5d6a7" : "#ef9a9a";
        label.classList.add(isCorrect ? "clone-correct" : "clone-incorrect");
      }
    });

    // Show feedback below the question
    const feedback = document.createElement("div");
    feedback.className = "clone-feedback";
    feedback.style.cssText = `margin-top:8px;padding:12px;border-radius:4px;border-left:3px solid ${isCorrect ? "#2e7d32" : "#e65100"};background:${isCorrect ? "#e8f5e9" : "#fff3e0"};`;

    let feedbackHtml = `<p style="font-size:13px;color:${isCorrect ? "#2e7d32" : "#e65100"};margin:0;font-weight:500">${isCorrect ? "Yes, the answer is correct." : "No, the answer is incorrect."}</p>`;
    feedbackHtml += `<p style="font-size:12px;color:rgba(0,0,0,0.6);margin:4px 0 0">Score: ${isCorrect ? points : 0} / ${points}</p>`;

    if (answerData && !isCorrect) {
      feedbackHtml += `<p style="font-size:13px;font-weight:600;color:rgba(0,0,0,0.7);margin:8px 0 4px">Accepted Answers:</p>`;
      answerData.correct.forEach(a => {
        feedbackHtml += `<p style="font-size:13px;color:#2e7d32;margin:2px 0">${a}</p>`;
      });
    }

    feedback.innerHTML = feedbackHtml;
    const questionDiv = qEl.closest(".qt-question") || qEl;
    questionDiv.appendChild(feedback);
  });

  // Score banner at top — only shows answered questions
  const banner = document.createElement("div");
  banner.className = "clone-score-banner";
  const perfect = totalScore === answeredPoints && answeredPoints > 0;
  banner.style.cssText = `background:${perfect ? "#e8f5e9" : "#fff3e0"};border:1px solid ${perfect ? "#a5d6a7" : "#ffcc80"};border-radius:4px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;`;

  const tryAgainBtn = `<button onclick="this.closest('.clone-score-banner').remove();document.querySelectorAll('.clone-feedback').forEach(e=>e.remove());document.querySelectorAll('.clone-correct,.clone-incorrect').forEach(e=>{e.style.removeProperty('background');e.style.removeProperty('border-color');e.classList.remove('clone-correct','clone-incorrect')});document.querySelectorAll('input[type=radio]:checked,input[type=checkbox]:checked').forEach(e=>{e.checked=false});document.querySelectorAll('input[type=text],input[type=number]').forEach(e=>{e.value=''})" style="background:#7b1f1f;color:white;border:none;padding:6px 16px;border-radius:4px;font-size:13px;cursor:pointer">Try Again</button>`;

  banner.innerHTML = `<span style="font-size:15px;font-weight:600;color:#212121">Score: ${totalScore} / ${answeredPoints}</span>${tryAgainBtn}`;
  container.insertBefore(banner, container.firstChild);
}
