import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Heart, Sparkles } from 'lucide-react-native';

interface GameResultsProps {
  matchName: string;
  stage: string;
  results: {
    answers: string[];
    shared: number;
  };
  onClose: () => void;
  onNextStage: () => void;
}

export default function GameResults({ 
  matchName, 
  stage, 
  results, 
  onClose, 
  onNextStage 
}: GameResultsProps) {
  const compatibility = Math.round((results.shared / results.answers.length) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Heart size={64} color="#FF00FF" strokeWidth={1.5} />
        
        <Text style={styles.title}>Stage Complete!</Text>
        <Text style={styles.subtitle}>
          You and {matchName} completed the {stage} stage
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{compatibility}%</Text>
            <Text style={styles.statLabel}>Compatibility</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{results.shared}</Text>
            <Text style={styles.statLabel}>Shared Answers</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{results.answers.length}</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
        </View>

        <View style={styles.insight}>
          <Sparkles size={24} color="#00FFFF" />
          <Text style={styles.insightText}>
            You both share a strong connection in how you view relationships!
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.nextButton} onPress={onNextStage}>
            <Text style={styles.nextButtonText}>Next Stage</Text>
          </Pressable>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>End Game</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 32,
    color: '#FF00FF',
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Rajdhani',
    fontSize: 18,
    color: '#00FFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 24,
    color: '#FF00FF',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Rajdhani',
    fontSize: 14,
    color: '#FFFFFF',
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00FFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    gap: 12,
  },
  insightText: {
    flex: 1,
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  nextButton: {
    backgroundColor: '#FF00FF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#000000',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 0, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#FF00FF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FF00FF',
  },
});