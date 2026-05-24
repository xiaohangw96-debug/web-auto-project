"use client";

import { useState, useCallback, useMemo } from "react";
import { Word, QuizQuestion } from "@/types";
import { words } from "@/data/words";
import { roots } from "@/data/roots";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateMeaningQuestion(word: Word, allWords: Word[]): QuizQuestion {
  const wrongOptions = shuffle(
    allWords.filter((w) => w.word !== word.word)
  )
    .slice(0, 3)
    .map((w) => w.meaning.split("；")[0]);

  const correct = word.meaning.split("；")[0];
  const options = shuffle([correct, ...wrongOptions]);

  return {
    type: "meaning",
    question: `${word.word} 的意思是：`,
    options,
    correct,
    word: word.word,
  };
}

function generateRootQuestion(allWords: Word[]): QuizQuestion {
  const usedRoots = new Set<string>();
  const rootQuestions: { root: string; meaning: string }[] = [];

  for (const word of allWords) {
    if (word.root && !usedRoots.has(word.root)) {
      usedRoots.add(word.root);
      const rootData = roots.find((r) => r.root === word.root);
      if (rootData) {
        rootQuestions.push({ root: word.root, meaning: rootData.meaning });
      }
    }
  }

  const selected = shuffle(rootQuestions)[0];
  const wrongOptions = shuffle(
    rootQuestions.filter((r) => r.root !== selected.root)
  )
    .slice(0, 3)
    .map((r) => r.meaning);

  const options = shuffle([selected.meaning, ...wrongOptions]);

  return {
    type: "root",
    question: `词根 ${selected.root} 的含义是：`,
    options,
    correct: selected.meaning,
    word: selected.root,
  };
}

function generateSpellingQuestion(word: Word): QuizQuestion {
  return {
    type: "spelling",
    question: `"${word.meaning.split("；")[0]}" 对应的英文单词是：`,
    options: [], // spelling questions need text input, not options
    correct: word.word,
    word: word.word,
  };
}

export function useQuiz(questionCount = 10) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [started, setStarted] = useState(false);
  const [quizType, setQuizType] = useState<"meaning" | "root" | "mixed">("meaning");

  const startQuiz = useCallback(
    (type: "meaning" | "root" | "mixed" = "meaning") => {
      setQuizType(type);
      const qs: QuizQuestion[] = [];
      const topWords = shuffle(words.filter((w) => w.frequency >= 2));

      if (type === "meaning") {
        for (let i = 0; i < Math.min(questionCount, topWords.length); i++) {
          qs.push(generateMeaningQuestion(topWords[i], words));
        }
      } else if (type === "root") {
        for (let i = 0; i < questionCount && i < 15; i++) {
          qs.push(generateRootQuestion(words));
        }
      } else {
        const mqCount = Math.floor(questionCount * 0.6);
        const rqCount = questionCount - mqCount;
        for (let i = 0; i < Math.min(mqCount, topWords.length); i++) {
          qs.push(generateMeaningQuestion(topWords[i], words));
        }
        for (let i = 0; i < rqCount; i++) {
          qs.push(generateRootQuestion(words));
        }
      }

      setQuestions(shuffle(qs));
      setCurrentIndex(0);
      setAnswers([]);
      setStarted(true);
    },
    [questionCount]
  );

  const answerQuestion = useCallback(
    (answer: string) => {
      const correct = answer === questions[currentIndex].correct;
      setAnswers((prev) => [...prev, correct]);
      return correct;
    },
    [questions, currentIndex]
  );

  const nextQuestion = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const reset = useCallback(() => {
    setStarted(false);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
  }, []);

  const currentQuestion = questions[currentIndex] || null;
  const isFinished = started && currentIndex >= questions.length;
  const score = answers.filter(Boolean).length;
  const total = questions.length;

  return {
    questions,
    currentQuestion,
    currentIndex,
    answers,
    started,
    isFinished,
    score,
    total,
    quizType,
    startQuiz,
    answerQuestion,
    nextQuestion,
    reset,
  };
}
