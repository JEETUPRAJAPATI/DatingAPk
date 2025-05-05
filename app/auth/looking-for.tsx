import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useUserProfile } from '../context/userContext';
import { LinearGradient } from 'expo-linear-gradient';

type Preference = 'Male' | 'Female' | 'Both';

export default function LookingForScreen() {
  const [selectedPreferences, setSelectedPreferences] = useState<Set<Preference>>(new Set());
  const { updateProfile } = useUserProfile();


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
      let valueToSave = '';
      const prefs = Array.from(selectedPreferences);

      if (prefs.includes('Male') && prefs.includes('Female')) {
        valueToSave = 'Both';
      } else if (prefs.length === 1) {
        valueToSave = prefs[0];
      }

      updateProfile({ interested_in: valueToSave });
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
          {(['Male', 'Female', 'Both'] as Preference[]).map((preference) => (
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
          onPress={handleContinue}
          disabled={selectedPreferences.size === 0}
          style={{
            width: '100%',
            opacity: selectedPreferences.size === 0 ? 0.5 : 1,
          }}
        >
          <LinearGradient
            colors={['#FF00FF', '#D000FF', '#8000FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 48,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#FF00FF',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 5,
              width: '100%',
            }}
          >
            <Text style={{
              fontFamily: 'Rajdhani-SemiBold',
              fontSize: 18,
              color: '#000000',
            }}>
              Continue
            </Text>
          </LinearGradient>
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
    borderColor: '#03d7fc',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#03d7fc',
    shadowColor: '#03d7fc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  optionText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#03d7fc',
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