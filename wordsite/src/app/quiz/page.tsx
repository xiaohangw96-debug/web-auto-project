"use client";

import { motion } from "framer-motion";
import { useQuiz } from "@/hooks/useQuiz";
import { useState } from "react";
import Link from "next/link";

export default function QuizPage() {
  const {
    currentQuestion,
    currentIndex,
    started,
    isFinished,
    score,
    total,
    startQuiz,
    answerQuestion,
    nextQuestion,
    reset,
  } = useQuiz(10);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [quizType, setQuizType] = useState<"meaning" | "root" | "mixed">("meaning");

  const handleStart = (type: "meaning" | "root" | "mixed") => {
    setQuizType(type);
    startQuiz(type);
    setSelectedAnswer(null);
    setLastCorrect(null);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    const correct = answerQuestion(answer);
    setLastCorrect(correct);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setLastCorrect(null);
    nextQuestion();
  };

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            单词测试
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            选择测试类型，检验你的学习成果
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            {([
              { type: "meaning" as const, title: "词义选择题", desc: "看单词选中文", icon: "📝" },
              { type: "root" as const, title: "词根选择题", desc: "看词根选含义", icon: "🌳" },
              { type: "mixed" as const, title: "综合测试", desc: "词义+词根混合", icon: "🎯" },
            ]).map((t) => (
              <button
                key={t.type}
                onClick={() => handleStart(t.type)}
                className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors text-left group"
              >
                <div className="text-2xl mb-2">{t.icon}</div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {t.title}
                </h3>
                <p className="text-xs text-gray-400">{t.desc}</p>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (isFinished) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-4xl mb-4">{pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "💪"}</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            测试完成！
          </h1>
          <div className="text-5xl font-bold text-primary-600 mb-4">{pct}%</div>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            正确 {score} / {total} 题
          </p>
          <div className="mb-8">
            <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden max-w-xs mx-auto">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              再来一次
            </button>
            <Link
              href="/review"
              className="px-6 py-3 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              去复习
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-400">
            第 {currentIndex + 1} / {total} 题
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            正确率 {score}/{currentIndex}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: `${total > 0 ? ((currentIndex + 1) / total) * 100 : 0}%` }}
          />
        </div>

        {/* Question */}
        {currentQuestion && (
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {currentQuestion.question}
            </h2>
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt, i) => {
                const letters = ["A", "B", "C", "D"];
                const isSelected = selectedAnswer === opt;
                const isCorrect = opt === currentQuestion.correct;
                let borderClass = "border-gray-100 dark:border-gray-800";

                if (selectedAnswer) {
                  if (isCorrect) borderClass = "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20";
                  else if (isSelected) borderClass = "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!selectedAnswer}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border ${borderClass} transition-colors text-left ${
                      selectedAnswer
                        ? "cursor-default"
                        : "hover:border-primary-200 dark:hover:border-primary-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <span className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xs font-medium text-gray-500 shrink-0">
                      {letters[i]}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                    {selectedAnswer && isCorrect && (
                      <svg className="w-5 h-5 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {selectedAnswer && isSelected && !isCorrect && (
                      <svg className="w-5 h-5 text-red-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedAnswer && (
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-sm ${lastCorrect ? "text-green-600" : "text-red-500"}`}>
                  {lastCorrect ? "✓ 回答正确！" : `✗ 正确答案：${currentQuestion.correct}`}
                </span>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  {currentIndex < total - 1 ? "下一题" : "查看结果"}
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
