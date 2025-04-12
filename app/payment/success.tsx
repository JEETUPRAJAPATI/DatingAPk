import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Shield } from 'lucide-react-native';

export default function PaymentSuccessScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Shield size={64} color="#FF00FF" />
        </View>

        <Text style={styles.title}>Payment Successful</Text>
        <Text style={styles.message}>
          Your payment has been successfully{'\n'}
          processed for the Gold membership{'\n'}
          of the year.
        </Text>
        <Text style={styles.submessage}>
          You will be notified Push Notification{'\n'}
          Once you will get access
        </Text>

        <Pressable 
          style={styles.button}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF00FF',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 24,
    color: '#FF00FF',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: '#FF00FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  message: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 26,
  },
  submessage: {
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#00FFFF',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
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
  buttonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#000000',
  },
});