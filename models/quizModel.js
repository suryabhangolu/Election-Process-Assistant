/**
 * @module quizModel
 * Represents the data model for the election quiz.
 */

export const quizData = [
  { 
    question: "What is the minimum voting age in India?", 
    options: [{text: "16", correct: false}, {text: "18", correct: true}, {text: "21", correct: false}] 
  },
  { 
    question: "What does EVM stand for?", 
    options: [{text: "Electronic Voting Machine", correct: true}, {text: "Election Voting Method", correct: false}, {text: "Early Voting Machine", correct: false}] 
  },
  { 
    question: "Who conducts the national elections in India?", 
    options: [{text: "Supreme Court", correct: false}, {text: "Election Commission of India", correct: true}, {text: "President", correct: false}] 
  },
  { 
    question: "What is NOTA?", 
    options: [{text: "National Organization for Transparency", correct: false}, {text: "None of the Above", correct: true}, {text: "New Order of Tax Authority", correct: false}] 
  },
  { 
    question: "How often are general elections held in India?", 
    options: [{text: "Every 4 years", correct: false}, {text: "Every 5 years", correct: true}, {text: "Every 6 years", correct: false}] 
  }
];
