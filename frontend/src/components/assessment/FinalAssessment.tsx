import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Award, AlertCircle } from 'lucide-react';
import api from '../../services/api';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

const ASSESSMENT_QUESTIONS: Question[] = [
  {
    question: 'What is the primary middleware used by ROS 2 for communication?',
    options: ['MQTT', 'DDS (Data Distribution Service)', 'WebRTC', 'gRPC'],
    correctAnswer: 1
  },
  {
    question: 'Which simulation platform is specifically designed by NVIDIA for robotics?',
    options: ['Gazebo', 'Isaac Sim', 'Webots', 'V-REP'],
    correctAnswer: 1
  },
  {
    question: 'What is the recommended depth camera for ROS 2 robotics projects?',
    options: ['Logitech C920', 'Intel RealSense', 'GoPro', 'Canon DSLR'],
    correctAnswer: 1
  },
  {
    question: 'Which NVIDIA Jetson board is recommended for advanced AI workloads?',
    options: ['Jetson Nano', 'Jetson Xavier', 'Jetson Orin', 'Jetson TX2'],
    correctAnswer: 2
  },
  {
    question: 'What does SLAM stand for in robotics?',
    options: [
      'Simultaneous Location and Mapping',
      'Simultaneous Localization and Mapping',
      'Sequential Learning and Motion',
      'System Level Architecture Model'
    ],
    correctAnswer: 1
  },
  {
    question: 'Which ROS 2 version is the current LTS (Long Term Support)?',
    options: ['Foxy', 'Galactic', 'Humble', 'Iron'],
    correctAnswer: 2
  },
  {
    question: 'What is the primary purpose of Nav2 in ROS 2?',
    options: ['Computer Vision', 'Navigation and Path Planning', 'Machine Learning', 'Simulation'],
    correctAnswer: 1
  },
  {
    question: 'Which framework is commonly used for object detection in robotics?',
    options: ['TensorFlow', 'YOLO', 'Both TensorFlow and YOLO', 'OpenCV only'],
    correctAnswer: 2
  },
  {
    question: 'What is the purpose of URDF in ROS 2?',
    options: [
      'User Interface Design',
      'Unified Robot Description Format',
      'Universal Runtime Data Format',
      'Utility for Robot Debugging'
    ],
    correctAnswer: 1
  },
  {
    question: 'Which communication pattern in ROS 2 is used for request-response interactions?',
    options: ['Topics', 'Services', 'Actions', 'Parameters'],
    correctAnswer: 1
  }
];

export const FinalAssessment: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSelectAnswer = (answerIndex: number) => {
    if (submitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate score
    let correctCount = 0;
    ASSESSMENT_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = (correctCount / ASSESSMENT_QUESTIONS.length) * 100;
    setScore(finalScore);
    setShowResults(true);

    try {
      // Submit to backend
      await api.post('/api/certificate/submit-assessment', {
        score: finalScore,
        answers: selectedAnswers
      });
      setSubmitted(true);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit assessment');
    }
  };

  const isAnswered = (questionIndex: number) => selectedAnswers[questionIndex] !== undefined;
  const allAnswered = selectedAnswers.length === ASSESSMENT_QUESTIONS.length &&
    selectedAnswers.every(a => a !== undefined);

  if (showResults) {
    const passed = score >= 70;
    return (
      <div style={styles.container}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={styles.resultsCard}
        >
          {passed ? (
            <Award size={80} color="#10b981" />
          ) : (
            <XCircle size={80} color="#ef4444" />
          )}

          <h2 style={styles.resultsTitle}>
            {passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}
          </h2>

          <div style={styles.scoreDisplay}>
            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: passed ? '#10b981' : '#ef4444' }}>
              {score.toFixed(1)}%
            </span>
            <p style={styles.scoreText}>
              {ASSESSMENT_QUESTIONS.filter((q, idx) => selectedAnswers[idx] === q.correctAnswer).length} / {ASSESSMENT_QUESTIONS.length} Correct
            </p>
          </div>

          {passed ? (
            <div>
              <p style={styles.passMessage}>
                You've successfully completed the Physical AI & Humanoid Robotics course!
              </p>
              <a href="/certificate" style={styles.certificateButton}>
                🎓 Get Your Certificate
              </a>
            </div>
          ) : (
            <div>
              <p style={styles.failMessage}>
                You need at least 70% to pass. Review the chapters and try again!
              </p>
              <button onClick={() => window.location.reload()} style={styles.retryButton}>
                Try Again
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  const question = ASSESSMENT_QUESTIONS[currentQuestion];

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.assessmentCard}
      >
        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
              style={styles.progressFill}
            />
          </div>
          <p style={styles.progressText}>
            Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
          </p>
        </div>

        {/* Question */}
        <div style={styles.questionSection}>
          <h3 style={styles.questionText}>{question.question}</h3>

          {/* Options */}
          <div style={styles.optionsContainer}>
            {question.options.map((option, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectAnswer(idx)}
                style={{
                  ...styles.optionButton,
                  backgroundColor: selectedAnswers[currentQuestion] === idx ? '#3b82f6' : '#ffffff',
                  color: selectedAnswers[currentQuestion] === idx ? '#ffffff' : '#111827',
                  borderColor: selectedAnswers[currentQuestion] === idx ? '#3b82f6' : '#e5e7eb',
                }}
              >
                <span style={styles.optionLabel}>{String.fromCharCode(65 + idx)}.</span>
                {option}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={styles.navigationContainer}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            style={{
              ...styles.navButton,
              opacity: currentQuestion === 0 ? 0.5 : 1,
              cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Previous
          </button>

          {currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              style={{
                ...styles.submitButton,
                opacity: allAnswered ? 1 : 0.5,
                cursor: allAnswered ? 'pointer' : 'not-allowed'
              }}
            >
              Submit Assessment
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={styles.navButton}
            >
              Next →
            </button>
          )}
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '1rem',
  },
  assessmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '2px solid #e5e7eb',
  },
  progressContainer: {
    marginBottom: '2rem',
  },
  progressBar: {
    width: '100%',
    height: '0.75rem',
    backgroundColor: '#e5e7eb',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    marginBottom: '0.5rem',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
    borderRadius: '0.5rem',
  },
  progressText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    textAlign: 'center' as const,
    margin: 0,
  },
  questionSection: {
    marginBottom: '2rem',
  },
  questionText: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '1.5rem',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  optionButton: {
    padding: '1rem 1.5rem',
    textAlign: 'left' as const,
    fontSize: '1rem',
    fontWeight: '500',
    border: '2px solid',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  optionLabel: {
    fontWeight: 'bold',
    minWidth: '1.5rem',
  },
  navigationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  navButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f3f4f6',
    color: '#111827',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  resultsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '3rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '2px solid #e5e7eb',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1.5rem',
  },
  resultsTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
  },
  scoreDisplay: {
    padding: '2rem',
    backgroundColor: '#f9fafb',
    borderRadius: '1rem',
    width: '100%',
  },
  scoreText: {
    fontSize: '1.25rem',
    color: '#6b7280',
    marginTop: '0.5rem',
  },
  passMessage: {
    fontSize: '1.125rem',
    color: '#374151',
    marginBottom: '1.5rem',
  },
  failMessage: {
    fontSize: '1.125rem',
    color: '#374151',
    marginBottom: '1.5rem',
  },
  certificateButton: {
    display: 'inline-block',
    padding: '1rem 2rem',
    backgroundColor: '#10b981',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: '600',
  },
  retryButton: {
    padding: '1rem 2rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  errorBanner: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    color: '#dc2626',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
};

export default FinalAssessment;
