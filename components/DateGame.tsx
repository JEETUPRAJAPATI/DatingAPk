import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg'; // Import Svg and Circle
// Create an animated version of the Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
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
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Reset progress to 0 and start new animation
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 32000,
      useNativeDriver: false,
    });

    animation.start();

    timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          animation.stop(); // Just in case
          progress.setValue(1); // Forcefully jump to end of animation
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);


    // Cleanup timer and animation
    return () => {
      clearInterval(timer);
      animation.stop();
    };
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

  const RADIUS = 58;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const progressStrokeDashoffset = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.circleWrapper}>
          <Svg width="120" height="120" viewBox="0 0 120 120">
            <Circle
              cx="60"
              cy="60"
              r="58"
              stroke="#e6e6e6"
              strokeWidth="4"
              fill="none"
            />
            <AnimatedCircle
              cx="60"
              cy="60"
              r={RADIUS}
              stroke="#FF00FF"
              strokeWidth="4"
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={progressStrokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)" // <-- magic line
            />


          </Svg>
          <Text style={styles.timer}>{timeLeft}s</Text>
        </View>
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

      {/* Apply LinearGradient to the End Game button */}
      <LinearGradient
        colors={['#FF00FF', '#D000FF', '#8000FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.closeButton}  // Apply the same styles
      >
        <Pressable onPress={onClose}>
          <Text style={styles.closeButtonText}>End Game</Text>
        </Pressable>
      </LinearGradient>
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
    marginTop: 16,
    alignItems: 'center',
  },

  circleWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  timer: {
    position: 'absolute',
    fontFamily: 'Orbitron-Bold',
    fontSize: 24,
    color: '#FF00FF',
    textAlign: 'center',
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
    color: '#03d7fc',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  option: {
    // backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#03d7fc',
    borderRadius: 12,
    padding: 16,
  },
  optionText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#03d7fc',
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
    color: '#000000',
  },
  errorText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FF00FF',
    textAlign: 'center',
    marginBottom: 24,
  },
});