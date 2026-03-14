import { useState, useEffect } from 'react';
import { Award, RefreshCcw } from 'lucide-react';
import { quizAPI } from '../services/api';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    try {
      const response = await quizAPI.getQuestions();
      setQuestions(response.data);
    } catch (err) {
      console.error('Error fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerClick = (optionIndex) => {
    if (optionIndex === questions[currentQIndex].correctAnswer) setScore(s => s + 1);
    const next = currentQIndex + 1;
    if (next < questions.length) {
      setCurrentQIndex(next);
    } else {
      submitQuiz();
      setShowResults(true);
    }
  };

  const submitQuiz = async () => {
    try { await quizAPI.submit({ score, total: questions.length }); }
    catch (err) { console.error(err); }
  };

  const restartQuiz = () => { setScore(0); setCurrentQIndex(0); setShowResults(false); };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen app-bg">
        <div className="dot-loader flex gap-2"><span /><span /><span /></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="text-center p-12" style={{ color: '#9A6B7A' }}>Failed to load quiz.</div>;
  }

  const progress = ((currentQIndex) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 py-10 animate-fade-in">

      {!showResults ? (
        <div className="bg-white rounded-3xl border border-[#FFCAD4] shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b" style={{ background: '#FFF0F3', borderColor: '#FFCAD4' }}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold" style={{ color: '#C94F7C' }}>
                Question {currentQIndex + 1} of {questions.length}
              </span>
              <span className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: '#FFCAD4', color: '#C94F7C' }}>
                Health Quiz
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full mb-4" style={{ background: '#FFCAD4' }}>
              <div className="h-full rounded-full transition-all duration-500"
                   style={{ width: `${progress}%`, background: '#C94F7C' }} />
            </div>
            <h2 className="text-lg md:text-xl font-bold" style={{ color: '#3A3A3A' }}>
              {questions[currentQIndex].question}
            </h2>
          </div>

          <div className="p-6 md:p-8 space-y-3">
            {questions[currentQIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                className="w-full text-left p-4 rounded-xl border text-sm font-medium transition-smooth"
                style={{ borderColor: '#FFCAD4', color: '#3A3A3A', background: '#fff' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C94F7C'; e.currentTarget.style.background = '#FFF0F3'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#FFCAD4'; e.currentTarget.style.background = '#fff'; }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#FFCAD4] shadow-sm p-8 text-center animate-fade-in">
          <div className="inline-flex justify-center items-center w-20 h-20 rounded-full mb-6"
               style={{ background: '#FFCAD4' }}>
            <Award className="w-10 h-10" style={{ color: '#C94F7C' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#3A3A3A' }}>Quiz Complete!</h2>

          <div className="rounded-2xl p-6 my-5 border" style={{ background: '#FFF5F7', borderColor: '#FFCAD4' }}>
            <p className="text-sm mb-1" style={{ color: '#9A6B7A' }}>Your Score</p>
            <p className="text-4xl font-bold" style={{ color: '#C94F7C' }}>{score} / {questions.length}</p>
          </div>

          <p className="text-sm leading-relaxed mb-7" style={{ color: '#9A6B7A' }}>
            {score === questions.length
              ? 'Perfect score! You have great knowledge about reproductive health.'
              : score > questions.length / 2
              ? 'Good job! You have a solid understanding of biological cycles.'
              : 'There\'s always more to learn. Check out the Doctor Posts for more information!'}
          </p>

          <button
            onClick={restartQuiz}
            className="btn-primary text-white font-semibold py-3 px-8 rounded-full flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCcw className="w-4 h-4" />
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
