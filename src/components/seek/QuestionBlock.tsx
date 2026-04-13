"use client";

import type { Question } from "@/lib/types";

interface QuestionBlockProps {
  question: Question;
}

export function QuestionBlock({ question: q }: QuestionBlockProps) {
  return (
    <div className="p-5" style={{ background: "#ffffff", borderRadius: 4, boxShadow: "0px 2px 1px -1px rgba(0,0,0,.2), 0px 1px 1px 0px rgba(0,0,0,.14), 0px 1px 3px 0px rgba(0,0,0,.12)", fontFamily: "Roboto, 'Helvetica Neue', sans-serif" }}>
      {/* Header: question number + marks + score */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[#7d8698]">
          Question {q.questionNumber}
        </span>
        <div className="flex items-center gap-2">
          {q.scoredMarks !== undefined && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                q.scoredMarks === q.marks
                  ? "bg-[#e8f5e9] text-[#039855]"
                  : q.scoredMarks === 0
                  ? "bg-[#fef3f2] text-[#d92d20]"
                  : "bg-[#fffaeb] text-[#b54708]"
              }`}
            >
              {q.scoredMarks}/{q.marks}
            </span>
          )}
          <span className="text-xs text-[#7d8698]">
            [{q.marks} mark{q.marks > 1 ? "s" : ""}]
          </span>
        </div>
      </div>

      {/* Question text */}
      <div className="mb-4 whitespace-pre-wrap" style={{ fontSize: 14, lineHeight: "20px", color: "rgba(0,0,0,0.87)", fontWeight: 400 }}>
        {q.text}
      </div>

      {/* MCQ / MSQ options */}
      {q.options && q.options.length > 0 && (
        <div className="space-y-2">
          {q.options.map((opt) => {
            const isSelected =
              q.studentAnswer &&
              (Array.isArray(q.studentAnswer)
                ? q.studentAnswer.includes(opt.label)
                : q.studentAnswer === opt.label);
            const isCorrect = opt.isCorrect;
            const inputType = q.type === "msq" ? "checkbox" : "radio";

            return (
              <label
                key={opt.id}
                className="flex items-start gap-3 p-3 rounded cursor-default transition"
                style={{
                  fontSize: 14,
                  border: `1px solid ${isCorrect ? "#039855" : isSelected && !isCorrect ? "#d92d20" : "rgba(0,0,0,0.12)"}`,
                  background: isCorrect ? "#e8f5e9" : isSelected && !isCorrect ? "#fef3f2" : "#fafafa",
                }}
              >
                <input
                  type={inputType}
                  checked={!!isSelected}
                  readOnly
                  className="mt-0.5"
                  style={{ accentColor: "#ff4081" }}
                />
                <span className="font-medium text-[#494f69] min-w-[1.5rem]">
                  {opt.label}.
                </span>
                <span className="flex-1" style={{ color: "rgba(0,0,0,0.87)" }}>{opt.text}</span>
                {isCorrect && (
                  <svg className="w-5 h-5 text-[#039855] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {isSelected && !isCorrect && (
                  <svg className="w-5 h-5 text-[#d92d20] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </label>
            );
          })}
        </div>
      )}

      {/* Numerical answer */}
      {q.type === "numerical" && (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={q.studentAnswer ? String(q.studentAnswer) : ""}
              placeholder="Enter your answer"
              className="border border-[#e0e0e0] rounded px-3 py-2 text-sm w-48 bg-[#fafafa] text-[#212121]"
            />
          </div>
          {q.correctAnswer && (
            <p className="text-xs text-[#039855] mt-1">
              Correct answer: {String(q.correctAnswer)}
            </p>
          )}
        </div>
      )}

      {/* Programming question */}
      {q.type === "programming" && (
        <div className="mt-2 bg-[#263238] text-[#e0e0e0] rounded p-4 font-mono text-xs overflow-x-auto">
          {q.studentAnswer ? String(q.studentAnswer) : "# Code will be displayed here"}
        </div>
      )}

      {/* Explanation */}
      {q.explanation && (
        <div className="mt-3 p-3 bg-[#e3f2fd] border border-[#90caf9] rounded text-xs text-[#1565c0] leading-relaxed">
          <strong>Explanation:</strong> {q.explanation}
        </div>
      )}
    </div>
  );
}
