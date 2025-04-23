import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { API_BASE_URL } from '../apiUrl';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignupScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignup = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: phoneNumber }),
      });

      const data = await res.json();

      console.log('Login rsponse:', data);
      if (data.status) {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: 'Please check your phone for the OTP.',
          position: 'top',
        })
        router.push({
          pathname: '/auth/verify',
          params: { mode: 'signup', mobile: phoneNumber }
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: data.errors[0].message,
          position: 'top',
        })
      }

    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'An error occurred while sending OTP. Please try again.',
        position: 'top',
      })
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
          <LinearGradient
            colors={['#FF00FF', '#D000FF', '#8000FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.inputGradientBorder}
          >
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={15}
            />
          </LinearGradient>
        </View>


        <Pressable
          onPress={handleSignup}
          disabled={phoneNumber.length < 10}
          style={{
            width: '100%',
            opacity: phoneNumber.length < 10 ? 0.5 : 1,
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
              Send OTP
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
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputGradientBorder: {
    paddingBottom: 2,
  },

  input: {
    height: 56,
    color: '#fff',
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    paddingHorizontal: 8,
    backgroundColor: '#000', // match container bg
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
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