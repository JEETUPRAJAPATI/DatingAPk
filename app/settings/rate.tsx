import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Star } from 'lucide-react-native';

export default function RateScreen() {
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const handleSubmitRating = () => {
    if (selectedRating > 0) {
      // Handle rating submission
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FF00FF" />
        </Pressable>
        <Text style={styles.title}>Rate App</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.message}>
          Enjoying NeonLove? Let us know how we're doing!
        </Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((rating) => (
            <Pressable
              key={rating}
              onPress={() => setSelectedRating(rating)}
            >
              <Star
                size={48}
                color={rating <= selectedRating ? '#FFD700' : '#333333'}
                fill={rating <= selectedRating ? '#FFD700' : 'none'}
              />
            </Pressable>
          ))}
        </View>

        <Text style={styles.ratingText}>
          {selectedRating > 0
            ? selectedRating === 5
              ? 'Excellent!'
              : selectedRating === 4
              ? 'Great!'
              : selectedRating === 3
              ? 'Good'
              : selectedRating === 2
              ? 'Fair'
              : 'Poor'
            : 'Tap a star to rate'}
        </Text>

        <Pressable
          style={[styles.submitButton, !selectedRating && styles.submitButtonDisabled]}
          onPress={handleSubmitRating}
          disabled={!selectedRating}
        >
          <Text style={styles.submitButtonText}>Submit Rating</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 32,
    color: '#FF00FF',
    textShadowColor: '#FF00FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  ratingText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 20,
    color: '#FFD700',
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: '#FF00FF',
    borderRadius: 20,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#000000',
  },
});