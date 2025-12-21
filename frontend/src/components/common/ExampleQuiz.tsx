import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { QuizComponent, QuizQuestion } from './QuizComponent';
import { userService } from '../../services/userService';

interface ExampleQuizProps {
  chapterNumber: number;
}

/**
 * Example Quiz for Chapter 1 - ROS 2 Fundamentals
 *
 * Usage in .mdx files:
 *
 * import ExampleQuiz from '@site/src/components/common/ExampleQuiz';
 *
 * <ExampleQuiz chapterNumber={1} />
 *
 * To create a custom quiz, copy QuizComponent and provide your own questions.
 */
export const ExampleQuiz: React.FC<ExampleQuizProps> = ({ chapterNumber }) => {
  // Example questions for Chapter 1
  const chapter1Questions: QuizQuestion[] = [
    {
      question: 'What does ROS stand for in robotics?',
      options: [
        'Robotic Operating System',
        'Robot Operating System',
        'Remote Operating Software',
        'Rapid Operation Service',
      ],
      correctAnswer: 1,
      explanation:
        'ROS stands for Robot Operating System. It is a flexible framework for writing robot software, providing tools and libraries to help build robot applications.',
    },
    {
      question: 'Which communication mechanism does ROS 2 primarily use?',
      options: ['HTTP REST API', 'DDS (Data Distribution Service)', 'WebSockets', 'TCP/IP Sockets'],
      correctAnswer: 1,
      explanation:
        'ROS 2 uses DDS (Data Distribution Service) as its middleware, which provides real-time, scalable, and reliable communication between nodes.',
    },
    {
      question: 'What is a ROS 2 node?',
      options: [
        'A hardware component',
        'A process that performs computation',
        'A configuration file',
        'A programming language',
      ],
      correctAnswer: 1,
      explanation:
        'A ROS 2 node is a process that performs computation. Nodes communicate with each other by publishing/subscribing to topics, calling services, or using actions.',
    },
    {
      question: 'Which Python version is recommended for ROS 2 Humble?',
      options: ['Python 2.7', 'Python 3.6', 'Python 3.10', 'Python 3.12'],
      correctAnswer: 2,
      explanation:
        'ROS 2 Humble (the LTS version) is designed to work with Python 3.10, which is the default Python version in Ubuntu 22.04 LTS.',
    },
    {
      question: 'What is the purpose of URDF in robotics?',
      options: [
        'To create user interfaces',
        'To describe robot kinematics and dynamics',
        'To manage databases',
        'To handle network protocols',
      ],
      correctAnswer: 1,
      explanation:
        'URDF (Unified Robot Description Format) is an XML format for describing a robot\'s physical configuration, including links, joints, sensors, and visual/collision properties.',
    },
  ];

  // You can create question sets for other chapters
  const questionSets: { [key: number]: QuizQuestion[] } = {
    1: chapter1Questions,
    // Add more chapters as needed
    // 2: chapter2Questions,
    // 3: chapter3Questions,
  };

  const questions = questionSets[chapterNumber] || chapter1Questions;

  const handleQuizComplete = async (score: number, passed: boolean) => {
    console.log(`Quiz completed! Score: ${score}%, Passed: ${passed}`);

    try {
      // Update chapter progress if passed
      if (passed) {
        await userService.updateProgress(chapterNumber, true);
        console.log(`Chapter ${chapterNumber} marked as completed!`);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <BrowserOnly fallback={<div>Loading quiz...</div>}>
      {() => (
        <QuizComponent
          chapterNumber={chapterNumber}
          questions={questions}
          passingScore={70}
          onComplete={handleQuizComplete}
        />
      )}
    </BrowserOnly>
  );
};

export default ExampleQuiz;
