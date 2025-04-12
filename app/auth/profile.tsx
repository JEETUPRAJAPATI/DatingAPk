import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

interface ProfileData {
  fullName: string;
  email: string;
  bio: string;
  interests: string;
  hobbies: string;
  height: string;
  weight: string;
  skinColor: string;
  address: string;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<ProfileData>({
    fullName: '',
    email: '',
    bio: '',
    interests: '',
    hobbies: '',
    height: '',
    weight: '',
    skinColor: '',
    address: '',
  });

  const isValid = () => {
    return (
      profile.fullName.trim() !== '' &&
      profile.email.trim() !== '' &&
      profile.bio.trim() !== ''
    );
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    if (isValid()) {
      router.push('/auth/notifications');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color="#FF00FF" />
      </Pressable>

      <Text style={styles.title}>Create Your Profile</Text>
      <Text style={styles.subtitle}>Tell us about yourself</Text>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name*</Text>
          <TextInput
            style={styles.input}
            value={profile.fullName}
            onChangeText={(text) => handleChange('fullName', text)}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email*</Text>
          <TextInput
            style={styles.input}
            value={profile.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>About You*</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={profile.bio}
            onChangeText={(text) => handleChange('bio', text)}
            multiline
            numberOfLines={4}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Interests</Text>
          <TextInput
            style={styles.input}
            value={profile.interests}
            onChangeText={(text) => handleChange('interests', text)}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hobbies</Text>
          <TextInput
            style={styles.input}
            value={profile.hobbies}
            onChangeText={(text) => handleChange('hobbies', text)}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Height</Text>
            <TextInput
              style={styles.input}
              value={profile.height}
              onChangeText={(text) => handleChange('height', text)}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Weight</Text>
            <TextInput
              style={styles.input}
              value={profile.weight}
              onChangeText={(text) => handleChange('weight', text)}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Skin Color</Text>
          <TextInput
            style={styles.input}
            value={profile.skinColor}
            onChangeText={(text) => handleChange('skinColor', text)}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={profile.address}
            onChangeText={(text) => handleChange('address', text)}
            multiline
            numberOfLines={3}
            placeholderTextColor="#666"
          />
        </View>

        <Pressable
          style={[styles.button, !isValid() && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!isValid()}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </ScrollView>
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
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 28,
    color: '#FF00FF',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Rajdhani',
    fontSize: 18,
    color: '#00FFFF',
    marginBottom: 24,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 16,
    color: '#FF00FF',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderColor: '#FF00FF',
    borderRadius: 12,
    color: '#fff',
    fontFamily: 'Rajdhani',
    fontSize: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
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
    marginVertical: 24,
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