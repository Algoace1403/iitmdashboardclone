"use client";

import type { Question } from "@/lib/types";

interface QuestionBlockProps {
  question: Question;
}

export function QuestionBlock({ question: q }: QuestionBlockProps) {
  return (
    <div className="bg-white border border-[#e0e0e0] rounded p-5">
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
      <div className="text-sm text-[#212121] mb-4 leading-relaxed whitespace-pre-wrap">
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
                className={`flex items-start gap-3 p-3 rounded border text-sm cursor-default transition ${
                  isCorrect
                    ? "border-[#039855] bg-[#e8f5e9]"
                    : isSelected && !isCorrect
                    ? "border-[#d92d20] bg-[#fef3f2]"
                    : "border-[#e0e0e0] bg-[#fafafa]"
                }`}
              >
                <input
                  type={inputType}
                  checked={!!isSelected}
                  readOnly
                  className="mt-0.5 accent-[#1976d2]"
                />
                <span className="font-medium text-[#494f69] min-w-[1.5rem]">
                  {opt.label}.
                </span>
                <span className="text-[#212121] flex-1">{opt.text}</span>
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
