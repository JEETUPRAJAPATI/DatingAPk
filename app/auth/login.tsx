import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

type SocialProvider = 'google' | 'facebook' | 'apple';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (provider: SocialProvider) => {
    setIsLoading(true);
    try {
      // Simulate social authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate fetching phone number from social profile
      const mockPhoneNumber = '+1234567890';
      setPhoneNumber(mockPhoneNumber);
    } catch (error) {
      console.error('Social login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
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
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.socialButtons}>
          <Pressable
            style={styles.socialButton}
            onPress={() => handleSocialLogin('google')}
            disabled={isLoading}
          >
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </Pressable>

          <Pressable
            style={styles.socialButton}
            onPress={() => handleSocialLogin('facebook')}
            disabled={isLoading}
          >
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg' }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Continue with Facebook</Text>
          </Pressable>

          {Platform.OS === 'ios' && (
            <Pressable
              style={[styles.socialButton, styles.appleButton]}
              onPress={() => handleSocialLogin('apple')}
              disabled={isLoading}
            >
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' }}
                style={[styles.socialIcon, styles.appleIcon]}
              />
              <Text style={[styles.socialButtonText, styles.appleButtonText]}>
                Continue with Apple
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

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
          onPress={handleContinue}
          disabled={phoneNumber.length < 10 || isLoading}
        >
          <Text style={styles.buttonText}>Continue with Phone</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Pressable onPress={() => router.push('/auth/signup')}>
            <Text style={styles.signupText}>Sign Up</Text>
          </Pressable>
        </View>
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
    fontSize: 32,
    color: '#FF00FF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: '#FF00FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontFamily: 'Rajdhani',
    fontSize: 18,
    color: '#00FFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  socialButtons: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF00FF',
  },
  appleButton: {
    backgroundColor: '#000',
    borderColor: '#FFF',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  appleIcon: {
    tintColor: '#FFF',
  },
  socialButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FF00FF',
  },
  appleButtonText: {
    color: '#FFF',
  },
  divider: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 0, 255, 0.3)',
  },
  dividerText: {
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#FF00FF',
    marginHorizontal: 16,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderColor: '#FF00FF',
    borderRadius: 28,
    color: '#fff',
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
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
  footer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  footerText: {
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#FFF',
  },
  signupText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 16,
    color: '#FF00FF',
  },
});