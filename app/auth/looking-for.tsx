import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

type Preference = 'man' | 'woman' | 'other';

export default function LookingForScreen() {
  const [selectedPreferences, setSelectedPreferences] = useState<Set<Preference>>(new Set());

  const togglePreference = (preference: Preference) => {
    const newPreferences = new Set(selectedPreferences);
    if (newPreferences.has(preference)) {
      newPreferences.delete(preference);
    } else {
      newPreferences.add(preference);
    }
    setSelectedPreferences(newPreferences);
  };

  const handleContinue = () => {
    if (selectedPreferences.size > 0) {
      router.push('/auth/profile');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color="#FF00FF" />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>I'm interested in...</Text>
        <Text style={styles.subtitle}>Select all that apply</Text>

        <View style={styles.optionsContainer}>
          {(['man', 'woman', 'other'] as Preference[]).map((preference) => (
            <Pressable
              key={preference}
              style={[
                styles.option,
                selectedPreferences.has(preference) && styles.optionSelected,
              ]}
              onPress={() => togglePreference(preference)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedPreferences.has(preference) && styles.optionTextSelected,
                ]}
              >
                {preference.charAt(0).toUpperCase() + preference.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={[styles.button, selectedPreferences.size === 0 && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={selectedPreferences.size === 0}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 24,
  },
  backButton: {
    marginTop: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -100,
  },
  title: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 28,
    color: '#FF00FF',
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
  optionsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  option: {
    height: 56,
    borderWidth: 2,
    borderColor: '#FF00FF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#FF00FF',
    shadowColor: '#FF00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  optionText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FF00FF',
  },
  optionTextSelected: {
    color: '#000',
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#FF00FF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#000000',
  },
});