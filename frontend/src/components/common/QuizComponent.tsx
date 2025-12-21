import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-based)
  explanation?: string;
}

interface QuizComponentProps {
  chapterNumber: number;
  questions: QuizQuestion[];
  passingScore?: number; // Percentage required to pass (default 70%)
  onComplete?: (score: number, passed: boolean) => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  chapterNumber,
  questions,
  passingScore = 70,
  onComplete,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      // Show results
      setShowResults(true);
      const score = calculateScore();
      const passed = score >= passingScore;
      if (onComplete) {
        onComplete(score, passed);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const handleCheckAnswer = () => {
    setShowExplanation(true);
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(Array(questions.length).fill(null));
    setShowResults(false);
    setShowExplanation(false);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / questions.length) * 100;
  };

  const isCurrentAnswerCorrect = () => {
    return selectedAnswers[currentQuestion] === questions[currentQuestion].correctAnswer;
  };

  const currentQuestionData = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];
  const score = calculateScore();
  const passed = score >= passingScore;

  if (showResults) {
    return (
      <div style={styles.container}>
        <div style={styles.resultsCard}>
          <div style={styles.resultsHeader}>
            {passed ? (
              <Award size={64} color="#10b981" />
            ) : (
              <XCircle size={64} color="#ef4444" />
            )}
            <h2 style={styles.resultsTitle}>
              {passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}
            </h2>
          </div>

          <div style={styles.scoreDisplay}>
            <div style={styles.scoreCircle}>
              <span style={{...styles.scoreText, color: passed ? '#10b981' : '#ef4444'}}>
                {score.toFixed(0)}%
              </span>
            </div>
            <p style={styles.scoreLabel}>Your Score</p>
          </div>

          <div style={styles.resultsSummary}>
            <p style={styles.summaryText}>
              You got{' '}
              <strong>
                {selectedAnswers.filter((ans, i) => ans === questions[i].correctAnswer).length}
              </strong>{' '}
              out of <strong>{questions.length}</strong> questions correct.
            </p>

            {passed ? (
              <p style={styles.passMessage}>
                ✅ Great job! You've passed this chapter's assessment.
              </p>
            ) : (
              <p style={styles.failMessage}>
                ❌ You need {passingScore}% to pass. Review the material and try again!
              </p>
            )}
          </div>

          <button onClick={handleRetake} style={styles.retakeButton}>
            <RotateCcw size={20} />
            Retake Quiz
          </button>
        </div>

        <style>{`
          [data-theme='dark'] .quiz-container {
            background-color: #1e293b !important;
            border-color: #334155 !important;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={styles.container} className="quiz-container">
      <div style={styles.header}>
        <h2 style={styles.title}>Chapter {chapterNumber} - Self-Assessment Quiz</h2>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
        <p style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <div style={styles.questionCard}>
        <h3 style={styles.question}>{currentQuestionData.question}</h3>

        <div style={styles.optionsContainer}>
          {currentQuestionData.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestionData.correctAnswer;
            const showCorrectness = showExplanation;

            let optionStyle = { ...styles.option };

            if (showCorrectness) {
              if (isCorrect) {
                optionStyle = { ...optionStyle, ...styles.optionCorrect };
              } else if (isSelected && !isCorrect) {
                optionStyle = { ...optionStyle, ...styles.optionIncorrect };
              }
            } else if (isSelected) {
              optionStyle = { ...optionStyle, ...styles.optionSelected };
            }

            return (
              <button
                key={index}
                onClick={() => !showExplanation && handleAnswerSelect(index)}
                disabled={showExplanation}
                style={optionStyle}
              >
                <span style={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span style={styles.optionText}>{option}</span>
                {showCorrectness && isCorrect && (
                  <CheckCircle2 size={20} color="#10b981" style={{ marginLeft: 'auto' }} />
                )}
                {showCorrectness && isSelected && !isCorrect && (
                  <XCircle size={20} color="#ef4444" style={{ marginLeft: 'auto' }} />
                )}
              </button>
            );
          })}
        </div>

        {showExplanation && currentQuestionData.explanation && (
          <div
            style={{
              ...styles.explanation,
              backgroundColor: isCurrentAnswerCorrect() ? '#ecfdf5' : '#fef2f2',
              borderColor: isCurrentAnswerCorrect() ? '#10b981' : '#ef4444',
            }}
          >
            <p style={styles.explanationTitle}>
              {isCurrentAnswerCorrect() ? '✅ Correct!' : '❌ Incorrect'}
            </p>
            <p style={styles.explanationText}>{currentQuestionData.explanation}</p>
          </div>
        )}
      </div>

      <div style={styles.actions}>
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          style={styles.navButton}
        >
          ← Previous
        </button>

        {!showExplanation && selectedAnswer !== null && (
          <button onClick={handleCheckAnswer} style={styles.checkButton}>
            Check Answer
          </button>
        )}

        {showExplanation && (
          <button onClick={handleNext} style={styles.nextButton}>
            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next →'}
          </button>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    border: '2px solid #e5e7eb',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1rem',
  },
  progressBar: {
    width: '100%',
    height: '0.5rem',
    backgroundColor: '#e5e7eb',
    borderRadius: '0.25rem',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
  },
  questionCard: {
    marginBottom: '2rem',
  },
  question: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.25rem',
    backgroundColor: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    textAlign: 'left',
  },
  optionSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  optionCorrect: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  optionIncorrect: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
  optionLetter: {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '0.875rem',
    flexShrink: 0,
  },
  optionText: {
    flex: 1,
    color: '#111827',
  },
  explanation: {
    marginTop: '1.5rem',
    padding: '1rem 1.25rem',
    borderRadius: '0.75rem',
    border: '2px solid',
  },
  explanationTitle: {
    fontWeight: '600',
    marginBottom: '0.5rem',
    fontSize: '1rem',
  },
  explanationText: {
    margin: 0,
    fontSize: '0.9375rem',
    lineHeight: '1.6',
    color: '#374151',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'space-between',
  },
  navButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f9fafb',
    border: '2px solid #e5e7eb',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    cursor: 'pointer',
  },
  checkButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
  },
  nextButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#10b981',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
  },
  resultsCard: {
    textAlign: 'center',
  },
  resultsHeader: {
    marginBottom: '2rem',
  },
  resultsTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    marginTop: '1rem',
  },
  scoreDisplay: {
    marginBottom: '2rem',
  },
  scoreCircle: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    border: '8px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  scoreText: {
    fontSize: '3rem',
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: '1.125rem',
    color: '#6b7280',
    fontWeight: '600',
  },
  resultsSummary: {
    marginBottom: '2rem',
  },
  summaryText: {
    fontSize: '1.125rem',
    color: '#374151',
    marginBottom: '1rem',
  },
  passMessage: {
    fontSize: '1rem',
    color: '#059669',
    fontWeight: '600',
  },
  failMessage: {
    fontSize: '1rem',
    color: '#dc2626',
    fontWeight: '600',
  },
  retakeButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
  },
};

export default QuizComponent;
