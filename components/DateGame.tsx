import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Heart } from 'lucide-react-native';

interface Question {
  id: string;
  text: string;
  options: string[];
}

interface GameProps {
  stage: string;
  onComplete: (results: { answers: string[]; shared: number }) => void;
  onClose: () => void;
}

const questions: Record<string, Question[]> = {
  icebreakers: [
    {
      id: '1',
      text: "What's your idea of a perfect first date?",
      options: [
        'Cozy coffee shop chat',
        'Adventure activity',
        'Romantic dinner',
        'Walking and talking',
      ],
    },
    {
      id: '2',
      text: 'How do you usually spend your weekends?',
      options: [
        'Outdoor adventures',
        'Netflix and chill',
        'Social gatherings',
        'Personal projects',
      ],
    },
    // Add more questions...
  ],
  values: [
    {
      id: '1',
      text: "What's most important in a relationship?",
      options: [
        'Trust and honesty',
        'Communication',
        'Shared interests',
        'Personal growth',
      ],
    },
    // Add more questions...
  ],
  // Add more stages...
};

export default function DateGame({ stage, onComplete, onClose }: GameProps) {
  // Validate that the stage exists and has questions
  if (!questions[stage] || !questions[stage].length) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No questions available for this stage.</Text>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    Animated.timing(progress, {
      toValue: 1,
      duration: 30000,
      useNativeDriver: false,
    }).start();

    return () => clearInterval(timer);
  }, [currentQuestion]);

  const handleTimeout = () => {
    if (currentQuestion < questions[stage].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
      progress.setValue(0);
    } else {
      handleGameComplete();
    }
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions[stage].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
      progress.setValue(0);
    } else {
      handleGameComplete();
    }
  };

  const handleGameComplete = () => {
    // Simulate matching with partner's answers
    const sharedAnswers = Math.floor(Math.random() * answers.length);
    onComplete({ answers, shared: sharedAnswers });
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timer}>{timeLeft}s</Text>
        <Animated.View
          style={[
            styles.progressBar,
            { width: progressWidth },
          ]}
        />
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionNumber}>
          Question {currentQuestion + 1} of {questions[stage].length}
        </Text>
        <Text style={styles.questionText}>
          {questions[stage][currentQuestion].text}
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {questions[stage][currentQuestion].options.map((option, index) => (
          <Pressable
            key={index}
            style={styles.option}
            onPress={() => handleAnswer(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>End Game</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  timer: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 24,
    color: '#FF00FF',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#FF00FF',
    borderRadius: 2,
  },
  questionContainer: {
    marginBottom: 32,
  },
  questionNumber: {
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#00FFFF',
    marginBottom: 8,
  },
  questionText: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  option: {
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#FF00FF',
    borderRadius: 12,
    padding: 16,
  },
  optionText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 0, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#FF00FF',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  closeButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 16,
    color: '#FF00FF',
  },
  errorText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FF00FF',
    textAlign: 'center',
    marginBottom: 24,
  },
});