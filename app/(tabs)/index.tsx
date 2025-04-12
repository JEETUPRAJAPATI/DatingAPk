import { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Sparkles, Zap, X } from 'lucide-react-native';

const SWIPE_THRESHOLD = 100;

interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  image: string;
  location: string;
}

const profiles: Profile[] = [
  {
    id: '1',
    name: 'Sarah',
    age: 28,
    bio: 'Adventure seeker and coffee enthusiast. Let\'s explore the world together! 🌎✈️',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop',
    location: 'New York, NY',
  },
  {
    id: '2',
    name: 'Alex',
    age: 26,
    bio: 'Music lover and amateur photographer. Looking for someone to share concerts and creative moments with. 🎵📸',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop',
    location: 'Los Angeles, CA',
  },
  {
    id: '3',
    name: 'Emma',
    age: 24,
    bio: 'Yoga instructor and plant mom. Seeking a partner in crime for mindful adventures and lazy Sundays. 🧘‍♀️🌿',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop',
    location: 'Miami, FL',
  },
];

export default function ExploreScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const profile = profiles[currentIndex];

  const nextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
      translateX.value = 0;
      translateY.value = 0;
    }
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        translateX.value = withSpring(event.translationX > 0 ? 500 : -500);
        runOnJS(nextProfile)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-200, 0, 200],
      [-30, 0, 30]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const handleAction = (action: 'spark' | 'vibe' | 'pass') => {
    if (action === 'spark') {
      translateX.value = withSpring(500, {}, () => {
        runOnJS(nextProfile)();
      });
    } else if (action === 'pass') {
      translateX.value = withSpring(-500, {}, () => {
        runOnJS(nextProfile)();
      });
    } else {
      // Handle vibe action
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>

      <View style={styles.cardContainer}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.card, cardStyle]}>
            <Image source={{ uri: profile.image }} style={styles.image} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.gradient}
            >
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{profile.name}, {profile.age}</Text>
                <Text style={styles.location}>{profile.location}</Text>
              </View>
            </LinearGradient>

            <Pressable
              style={[styles.bioContainer, expanded && styles.bioExpanded]}
              onPress={() => setExpanded(!expanded)}
            >
              <Text style={styles.bio} numberOfLines={expanded ? undefined : 2}>
                {profile.bio}
              </Text>
            </Pressable>
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleAction('pass')}
        >
          <X size={32} color="#FF00FF" />
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.vibeButton]}
          onPress={() => handleAction('vibe')}
        >
          <Zap size={32} color="#00FFFF" />
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.sparkButton]}
          onPress={() => handleAction('spark')}
        >
          <Sparkles size={32} color="#39FF14" />
        </Pressable>
      </View>
    </GestureHandlerRootView>
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
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FF00FF',
    shadowColor: '#FF00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
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
    justifyContent: 'flex-end',
    padding: 20,
  },
  profileInfo: {
    marginBottom: 60,
  },
  name: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: '#FF00FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  location: {
    fontFamily: 'Rajdhani',
    fontSize: 18,
    color: '#00FFFF',
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  bioContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#FF00FF',
  },
  bioExpanded: {
    height: '50%',
  },
  bio: {
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  passButton: {
    borderColor: '#FF00FF',
    shadowColor: '#FF00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  vibeButton: {
    borderColor: '#00FFFF',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  sparkButton: {
    borderColor: '#39FF14',
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
});