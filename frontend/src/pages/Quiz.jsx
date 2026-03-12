import { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, RefreshCcw } from 'lucide-react';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/quiz')
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching quiz:", err);
        setLoading(false);
      });
  }, []);

  const handleAnswerClick = (optionIndex) => {
    const currentQuestion = questions[currentQIndex];
    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQIndex(nextQuestion);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setScore(0);
    setCurrentQIndex(0);
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-lavender"></div>
      </div>
    );
  }

  if (questions.length === 0) {
     return <div className="text-center p-12 text-gray-500">Failed to load quiz.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 py-12 animate-fade-in">
      
      {!showResults ? (
        <div className="bg-white rounded-3xl shadow-lg border border-soft-lavender/30 overflow-hidden">
          <div className="bg-gradient-to-r from-soft-lavender to-deep-lavender p-6 md:p-8">
            <div className="flex justify-between items-center text-white mb-2">
              <span className="font-semibold">Question {currentQIndex + 1} of {questions.length}</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Test Your Knowledge</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-4">{questions[currentQIndex].question}</h2>
          </div>
          
          <div className="p-6 md:p-8 space-y-4">
            {questions[currentQIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-deep-lavender hover:bg-soft-lavender/10 text-gray-700 font-medium transition-smooth"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg border border-soft-lavender/30 p-8 text-center animate-fade-in">
          <div className="inline-flex justify-center items-center w-24 h-24 bg-soft-lavender/20 rounded-full mb-6">
            <Award className="w-12 h-12 text-deep-lavender" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          
          <div className="bg-gray-50 rounded-2xl p-6 my-6 border border-gray-100">
            <p className="text-gray-500 mb-1">Your Score</p>
            <p className="text-4xl font-bold text-deep-lavender">{score} / {questions.length}</p>
          </div>
          
          <p className="text-gray-600 mb-8">
            {score === questions.length ? "Perfect score! You have great knowledge about reproductive health." : 
             score > questions.length / 2 ? "Good job! You have a solid understanding of biological cycles." : 
             "There's always more to learn. Check out the Doctor Posts for more information!"}
          </p>

          <button 
            onClick={restartQuiz}
            className="bg-deep-lavender hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-full transition-smooth flex items-center justify-center gap-2 mx-auto shadow-md"
          >
            <RefreshCcw className="w-5 h-5" />
            Retake Quiz
          </button>
        </div>
      )}

    </div>
  );
};

export default Quiz;
