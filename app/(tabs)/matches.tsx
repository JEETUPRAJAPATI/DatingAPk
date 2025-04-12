import { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { Video, MessageSquare, Gamepad2, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateGame from '@/components/DateGame';
import GameResults from '@/components/GameResults';

interface Match {
  id: string;
  name: string;
  age: number;
  image: string;
  matchPercentage: number;
  lastActive: string;
  status: 'online' | 'offline';
}

const matches: Match[] = [
  {
    id: '1',
    name: 'Emma',
    age: 24,
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop',
    matchPercentage: 95,
    lastActive: '2m ago',
    status: 'online',
  },
  {
    id: '2',
    name: 'Sarah',
    age: 28,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop',
    matchPercentage: 88,
    lastActive: '1h ago',
    status: 'offline',
  },
  {
    id: '3',
    name: 'Jessica',
    age: 26,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop',
    matchPercentage: 92,
    lastActive: 'Just now',
    status: 'online',
  },
];

interface GameStage {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

const gameStages: GameStage[] = [
  {
    id: 'icebreakers',
    title: 'Icebreakers',
    description: 'Fun and light questions to get started',
    icon: <Heart size={24} color="#FF69B4" />,
    color: '#FF69B4',
  },
  {
    id: 'values',
    title: 'Values & Lifestyle',
    description: 'Discover shared principles and habits',
    icon: <Heart size={24} color="#4169E1" />,
    color: '#4169E1',
  },
  {
    id: 'feelings',
    title: 'Feelings & Memories',
    description: 'Share emotional experiences',
    icon: <Heart size={24} color="#9370DB" />,
    color: '#9370DB',
  },
  {
    id: 'flirting',
    title: 'Flirting & Attraction',
    description: 'Explore romantic chemistry',
    icon: <Heart size={24} color="#FF1493" />,
    color: '#FF1493',
  },
  {
    id: 'intimacy',
    title: 'Emotional Intimacy',
    description: 'Deep and meaningful connection',
    icon: <Heart size={24} color="#FF4500" />,
    color: '#FF4500',
  },
];

export default function MatchesScreen() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showGameStages, setShowGameStages] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [gameResults, setGameResults] = useState<{
    answers: string[];
    shared: number;
  } | null>(null);

  const handleGameInvite = (match: Match) => {
    setSelectedMatch(match);
    setShowGameStages(true);
  };

  const handleStageSelect = (stageId: string) => {
    setSelectedStage(stageId);
    setGameStarted(true);
    setShowGameStages(false);
  };

  const handleGameComplete = (results: { answers: string[]; shared: number }) => {
    setGameResults(results);
  };

  const handleNextStage = () => {
    setGameResults(null);
    setShowGameStages(true);
  };

  const handleCloseGame = () => {
    setSelectedMatch(null);
    setShowGameStages(false);
    setGameStarted(false);
    setSelectedStage('');
    setGameResults(null);
  };

  return (
    <View style={styles.container}>
      {!gameStarted && !gameResults ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Matches</Text>
            <Text style={styles.subtitle}>Your cosmic connections</Text>
          </View>

          <ScrollView style={styles.matchesList} showsVerticalScrollIndicator={false}>
            {matches.map((match) => (
              <View key={match.id} style={styles.matchCard}>
                <Image source={{ uri: match.image }} style={styles.matchImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.gradient}
                />
                
                <View style={styles.matchInfo}>
                  <View>
                    <Text style={styles.matchName}>
                      {match.name}, {match.age}
                    </Text>
                    <Text style={styles.lastActive}>
                      {match.status === 'online' ? (
                        <Text style={styles.onlineStatus}>● Online</Text>
                      ) : (
                        match.lastActive
                      )}
                    </Text>
                  </View>

                  <View style={styles.matchBadge}>
                    <Text style={styles.matchPercentage}>{match.matchPercentage}%</Text>
                    <Text style={styles.matchLabel}>Match</Text>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <Pressable style={styles.actionButton}>
                    <Video size={24} color="#FF00FF" />
                    <Text style={styles.actionText}>Video</Text>
                  </Pressable>

                  <Pressable 
                    style={styles.actionButton}
                    onPress={() => handleGameInvite(match)}
                  >
                    <Gamepad2 size={24} color="#00FFFF" />
                    <Text style={styles.actionText}>Play</Text>
                  </Pressable>

                  <Pressable style={styles.actionButton}>
                    <MessageSquare size={24} color="#39FF14" />
                    <Text style={styles.actionText}>Chat</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>

          {showGameStages && selectedMatch && (
            <View style={styles.gameModal}>
              <View style={styles.gameModalContent}>
                <Text style={styles.gameModalTitle}>
                  Date Game with {selectedMatch.name}
                </Text>
                <Text style={styles.gameModalSubtitle}>
                  Choose a stage to begin
                </Text>

                <ScrollView style={styles.stagesList} showsVerticalScrollIndicator={false}>
                  {gameStages.map((stage) => (
                    <Pressable
                      key={stage.id}
                      style={[styles.stageCard, { borderColor: stage.color }]}
                      onPress={() => handleStageSelect(stage.id)}
                    >
                      <View style={[styles.stageIcon, { backgroundColor: stage.color }]}>
                        {stage.icon}
                      </View>
                      <View style={styles.stageInfo}>
                        <Text style={styles.stageTitle}>{stage.title}</Text>
                        <Text style={styles.stageDescription}>
                          {stage.description}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>

                <Pressable
                  style={styles.closeButton}
                  onPress={handleCloseGame}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </Pressable>
              </View>
            </View>
          )}
        </>
      ) : gameResults ? (
        <GameResults
          matchName={selectedMatch?.name || ''}
          stage={selectedStage}
          results={gameResults}
          onClose={handleCloseGame}
          onNextStage={handleNextStage}
        />
      ) : (
        <DateGame
          stage={selectedStage}
          onComplete={handleGameComplete}
          onClose={handleCloseGame}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 32,
    color: '#FF00FF',
    textShadowColor: '#FF00FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontFamily: 'Rajdhani',
    fontSize: 18,
    color: '#00FFFF',
    marginTop: 4,
  },
  matchesList: {
    flex: 1,
    padding: 20,
  },
  matchCard: {
    height: 400,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FF00FF',
    backgroundColor: '#1A1A1A',
  },
  matchImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  matchInfo: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
  },
  matchName: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  lastActive: {
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 4,
  },
  onlineStatus: {
    color: '#39FF14',
  },
  matchBadge: {
    backgroundColor: 'rgba(255, 0, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF00FF',
  },
  matchPercentage: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 20,
    color: '#FF00FF',
  },
  matchLabel: {
    fontFamily: 'Rajdhani',
    fontSize: 14,
    color: '#FF00FF',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopWidth: 1,
    borderColor: '#FF00FF',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontFamily: 'Rajdhani',
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
  },
  gameModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    padding: 20,
  },
  gameModalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FF00FF',
  },
  gameModalTitle: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 24,
    color: '#FF00FF',
    textAlign: 'center',
    marginBottom: 8,
  },
  gameModalSubtitle: {
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#00FFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  stagesList: {
    maxHeight: 400,
  },
  stageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  stageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stageInfo: {
    flex: 1,
  },
  stageTitle: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  stageDescription: {
    fontFamily: 'Rajdhani',
    fontSize: 14,
    color: '#CCCCCC',
  },
  closeButton: {
    backgroundColor: '#FF00FF',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
});