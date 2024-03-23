import React, { useEffect, useState } from "react";
import quizData from "./quizData.json";
import { BsChevronLeft } from "react-icons/bs";

const App = () => {
  const questions = quizData.questions;

  // Function to randomize questions
  const randomize = (array) => {
    const randomArr = [...array];
    for (let i = randomArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomArr[i], randomArr[j]] = [randomArr[j], randomArr[i]];
    }
    return randomArr;
  };

  const totalQues = questions.length;

  // States
  const [showStart, setShowStart] = useState(true); // State to show start page
  const [randomQues, setRandomQues] = useState(randomize(questions)); // State for randomized questions
  const [randomOptions, setRandomOptions] = useState([]); // State for randomized options for current question
  const [currentQuestion, setCurrentQuestion] = useState(0); // State for current question index
  const [showScore, setShowScore] = useState(false); // State to show score page
  const [score, setScore] = useState(0); // State for user's score
  const [animation, setAnimation] = useState(""); // State for animation effect

  // Function to randomize options for current question
  const currentOptions = () => {
    if (currentQuestion >= 0 && currentQuestion < totalQues) {
      const options = randomize(randomQues[currentQuestion].options);
      setRandomOptions(options);
    }
  };

  useEffect(() => {
    currentOptions(); // Update options whenever currentQuestion changes
  }, [currentQuestion]);

  // Function to handle user option selection
  const handleOption = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1); // Increment score if the option is correct
    }

    // Animation effect
    setAnimation("fade-out");
    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < totalQues) {
        setCurrentQuestion(nextQuestion); // Move to next question if available
        setAnimation("fade-in");
      } else {
        setShowScore(true); // Show score page if no more questions available
      }
    }, 500);
  };

  // Function to navigate to previous question
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1); // Move to previous question
      setAnimation("fade-out"); // Apply animation effect
      setTimeout(() => {
        setAnimation("fade-in");
        currentOptions(); // Update options for the previous question
      }, 500);
    }
  };

  // Function to Restart the Quiz
  const restartQuiz = () => {
    setRandomQues(randomize(questions)); // Randomize questions again
    setCurrentQuestion(0); // Reset current question index
    setShowScore(false); // Hide score page
    setScore(0); // Reset score
    setAnimation(""); // Reset animation
    currentOptions(); // Update options for the first question
  };

  // Function to start the Quiz
  const startQuiz = () => {
    setShowStart(false); // Hide start page
  };

  const progress = ((currentQuestion + 1) / totalQues) * 100; // Calculate progress percentage

  return (
    <div className="app">
      {showStart ? (
        <div className="home__page">
          <h1>Welcome to the Saffron Quiz</h1>
          <p>Test My Assignment by starting the Quiz</p>
          <button onClick={startQuiz}>Start Quiz</button>
        </div>
      ) : showScore ? (
        <div className="score__section">
          <p>
            You Scored <span>{score}</span> out of {totalQues}
          </p>
          <button onClick={restartQuiz}>Retake Quiz</button>
        </div>
      ) : (
        <>
          <div className="question__section">
            <div className="question__count">
            <span className="chevron-icon" onClick={prevQuestion}>
              <BsChevronLeft />
            </span>
              <span>{(currentQuestion + 1).toString().padStart(2, "0")}</span>/
              {totalQues.toString().padStart(2, "0")}
            </div>
            <div className="progress__bar">
              <div
                className="progress__indicator"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className={`question__text ${animation}`}>
              {randomQues[currentQuestion].question}
            </div>
            <p>History of Art</p>
          </div>

          <div className="answer__section">
            <div className={`answer__section-btns ${animation}`}>
              {randomOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOption(option.isCorrect)}
                >
                  <span>{String.fromCharCode(97 + index)}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;