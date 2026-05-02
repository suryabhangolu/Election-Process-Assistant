import { quizData } from '../models/quizModel.js';
import { checkAnswer } from '../utils/validation.js';
import { trackUserAction } from '../services/analyticsService.js';

/**
 * @module quizController
 * Handles quiz UI interaction and logic.
 */

let currentQuestionIndex = 0;
let score = 0;

/**
 * Handles user interaction when an option is selected in the quiz.
 * @param {Event} e - The click event object.
 * @returns {void}
 */
const handleQuizAnswer = (e) => {
  const isCorrect = checkAnswer(e.target.getAttribute('data-correct'));
  const quizBtns = document.querySelectorAll('.quiz-btn');
  const feedback = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('quiz-next-btn');

  // Disable all options
  quizBtns.forEach(b => {
    b.disabled = true;
    b.classList.remove('correct', 'wrong');
  });

  feedback.classList.remove('sr-only');
  
  if (isCorrect) {
    e.target.classList.add('correct');
    feedback.textContent = "Correct!";
    feedback.className = "quiz-feedback success-text mt-4 font-bold text-accent";
    score++;
    trackUserAction("quiz_answer", { result: "correct" });
  } else {
    e.target.classList.add('wrong');
    feedback.textContent = "Incorrect. Try again next time!";
    feedback.className = "quiz-feedback error-text mt-4 font-bold text-accent";
    trackUserAction("quiz_answer", { result: "incorrect" });
  }

  // Show Next button if more questions exist
  if (currentQuestionIndex < quizData.length - 1) {
    nextBtn.classList.remove('hidden');
  } else {
    nextBtn.textContent = "Quiz Completed";
    nextBtn.classList.remove('hidden');
    nextBtn.disabled = true;
    const scoreEl = document.getElementById('quiz-score');
    if (scoreEl) {
      scoreEl.textContent = `You scored ${score} out of ${quizData.length}!`;
    }
  }
};

/**
 * Renders the current quiz question and its options.
 * @returns {void}
 */
const renderQuizQuestion = () => {
  const questionEl = document.getElementById('quiz-question');
  const optionsContainer = document.getElementById('quiz-options');
  const feedback = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('quiz-next-btn');

  if (!questionEl || !optionsContainer || !feedback || !nextBtn) return;

  const currentQ = quizData[currentQuestionIndex];
  questionEl.textContent = currentQ.question;
  optionsContainer.innerHTML = '';
  
  feedback.classList.add('sr-only');
  feedback.textContent = '';
  nextBtn.classList.add('hidden');

  currentQ.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-btn';
    btn.setAttribute('aria-label', `Option ${opt.text}`);
    btn.setAttribute('data-correct', opt.correct.toString());
    btn.textContent = opt.text;
    
    // Attach click listener for answering
    btn.addEventListener('click', handleQuizAnswer);
    optionsContainer.appendChild(btn);
  });
};

/**
 * Initializes quiz interaction logic and feedback display.
 * @returns {void}
 */
export const setupQuiz = () => {
  try {
    const nextBtn = document.getElementById('quiz-next-btn');
    if (!nextBtn) return;
    
    nextBtn.addEventListener('click', () => {
      if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        renderQuizQuestion();
      }
    });

    renderQuizQuestion();
  } catch (error) {
    console.error("Error setting up quiz:", error);
  }
};
