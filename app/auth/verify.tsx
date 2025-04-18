import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function VerifyScreen() {
  const { mode } = useLocalSearchParams<{ mode: 'login' | 'signup' }>();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if text is entered
    if (text && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.join('').length === 4) {
      if (mode === 'signup') {
        router.push('/auth/gender');
      } else {
        router.push('/auth/verification-success');
      }
    }
  };

  const handleResendOTP = () => {
    if (timeLeft === 0) {
      setTimeLeft(60);
      // Simulate resending OTP
      setOtp(['', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0]?.focus();
      }
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color="#FF00FF" />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          Enter the verification code we sent to your phone
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => inputRefs.current[index] = ref}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled
              ]}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
            />
          ))}
        </View>

        <Pressable
          style={[styles.button, otp.join('').length < 4 && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={otp.join('').length < 4}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </Pressable>

        <Pressable
          style={[styles.resendButton, timeLeft > 0 && styles.resendButtonDisabled]}
          onPress={handleResendOTP}
          disabled={timeLeft > 0}
        >
          <Text style={[styles.resendText, timeLeft > 0 && styles.resendTextDisabled]}>
            {timeLeft > 0 ? `Resend code in ${timeLeft}s` : 'Resend code'}
          </Text>
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
  otpContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  otpInput: {
    width: 56,
    height: 56,
    borderWidth: 2,
    borderColor: '#FF00FF',
    borderRadius: 12,
    color: '#fff',
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 24,
    textAlign: 'center',
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