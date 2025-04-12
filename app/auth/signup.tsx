import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function SignupScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendOTP = () => {
    if (phoneNumber.length >= 10) {
      router.push('/auth/verify');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color="#FF00FF" />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>Enter Your Number</Text>
        <Text style={styles.subtitle}>We'll send you a verification code</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={15}
          />
        </View>

        <Pressable
          style={[styles.button, phoneNumber.length < 10 && styles.buttonDisabled]}
          onPress={handleSendOTP}
          disabled={phoneNumber.length < 10}
        >
          <Text style={styles.buttonText}>Send OTP</Text>
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
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    height: 56,
    borderBottomWidth: 2,
    borderBottomColor: '#FF00FF',
    color: '#fff',
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    paddingHorizontal: 8,
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