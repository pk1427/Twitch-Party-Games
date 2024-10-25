import React, { useState, useEffect } from "react";
import WebSocketService from "../../services/WebSocketService"; 

const TriviaGame = () => {
  const [question, setQuestion] = useState(null); // Stores the current trivia question
  const [options, setOptions] = useState([]); // Stores the answer options
  const [playerAnswer, setPlayerAnswer] = useState(null); // Stores the selected answer
  const [correctAnswer, setCorrectAnswer] = useState(null); // Stores the correct answer
  const [timeLeft, setTimeLeft] = useState(15); // Timer for each question
  const [score, setScore] = useState(0); // Player's score
  const [message, setMessage] = useState(""); // Game messages (correct/incorrect answer, etc.)

  useEffect(() => {
    // Connect to WebSocket on component mount
    WebSocketService.connect();

    // Listen for incoming trivia question from WebSocket server
    WebSocketService.listen((data) => {
      const parsedData = JSON.parse(data);

      if (parsedData.type === "trivia_question") {
        setQuestion(parsedData.question);
        setOptions(parsedData.options);
        setTimeLeft(15); // Reset timer for each new question
        setPlayerAnswer(null); // Reset the selected answer
        setCorrectAnswer(null); // Reset correct answer state
        setMessage(""); // Reset message
      }

      // Receive game result messages
      if (parsedData.type === "trivia_result") {
        setMessage(parsedData.message);
        setCorrectAnswer(parsedData.correctAnswer); // Store the correct answer
        if (parsedData.correct) {
          setScore((prev) => prev + 1); // Increment score if answer is correct
        }
      }
    });

    // Timer countdown for each question
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Cleanup when component unmounts
    return () => {
      WebSocketService.disconnect();
      clearInterval(timerInterval);
    };
  }, []);

  // Handle answer selection
  const handleAnswer = (answer) => {
    setPlayerAnswer(answer);
    WebSocketService.sendMessage(
      JSON.stringify({ type: "submit_answer", answer })
    );
  };

  return (
    <div>
      <h1>Trivia Game</h1>

      {question ? (
        <div>
          <h2>{question}</h2>
          <div>
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={timeLeft === 0 || playerAnswer !== null}
                style={{
                  backgroundColor:
                    playerAnswer === index
                      ? index === correctAnswer
                        ? "green" // Green for correct answer
                        : "red" // Red for incorrect answer
                      : index === correctAnswer
                      ? "green" // Highlight the correct answer after submission
                      : ""
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <p>Time left: {timeLeft}s</p>
          <p>{message}</p>
        </div>
      ) : (
        <p>Waiting for next question...</p>
      )}

      <h3>Your Score: {score}</h3>
    </div>
  );
};

export default TriviaGame;
