import { View, Text, StyleSheet, Pressable, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Heart } from 'lucide-react-native';

export default function IntroScreen() {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop' }}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', '#000']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logobg.png')}  // Path to your logo image
              style={styles.logo}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.loginButton]}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>

            <Pressable onPress={() => router.push('/auth/signup')} style={{ width: '100%' }}>
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
                  Sign Up
                </Text>
              </LinearGradient>
            </Pressable>

          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  logo: {
    width: 150,  // Adjust the width of the logo
    height: 150, // Adjust the height of the logo
    resizeMode: 'contain',  // This ensures the logo keeps its aspect ratio
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 48,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: '30%',
  },
  title: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 42,
    color: '#FF00FF',
    marginTop: 16,
    textShadowColor: '#FF00FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 20,
    color: '#00FFFF',
    marginTop: 8,
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF00FF',
    shadowColor: '#FF00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  signupButton: {
    backgroundColor: '#FF00FF',
    shadowColor: '#FF00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FF00FF',
  },
  signupButtonText: {
    color: '#000000',
  },
});