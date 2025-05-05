import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const paymentMethods = [
  {
    id: 'paypal',
    name: 'PayPal',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
  },
  {
    id: 'razorpay',
    name: 'Razorpay',
    logo: 'https://razorpay.com/assets/razorpay-logo.svg',
  },
];

export default function PaymentMethodScreen() {
  const { plan, price } = useLocalSearchParams<{ plan: string; price: string }>();

  const handlePayment = () => {
    router.push('/payment/success');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FF00FF" />
        </Pressable>
        <Text style={styles.title}>Payment Method</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.planCard}>
          <Text style={styles.planName}>{plan}</Text>
          <Text style={styles.planPrice}>${price}</Text>
        </View>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        {paymentMethods.map((method) => (
          <Pressable
            key={method.id}
            style={styles.methodButton}
            onPress={handlePayment}
          >
            <Image
              source={{ uri: method.logo }}
              style={styles.methodLogo}
              resizeMode="contain"
            />
            <Text style={styles.methodName}>{method.name}</Text>
          </Pressable>
        ))}

        <LinearGradient
          colors={['#FF00FF', '#D000FF', '#8000FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.payButtonGradient}
        >
          <Pressable onPress={handlePayment}>
            <Text style={styles.payButtonText}>Process to Pay</Text>
          </Pressable>
        </LinearGradient>

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
    fontSize: 24,
    color: '#FF00FF',
    textShadowColor: '#FF00FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  planCard: {
    // backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#03d7fc',
  },
  planName: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 20,
    color: '#FF00FF',
    marginBottom: 8,
  },
  planPrice: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 32,
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#00FFFF',
    marginBottom: 16,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#03d7fc',
  },
  methodLogo: {
    width: 80,
    height: 32,
    marginRight: 16,
  },
  methodName: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  payButtonGradient: {
    backgroundColor: 'rgba(255, 0, 255, 0.2)', // Soft fallback color (for old devices)
    borderRadius: 28, // Rounded corners
    padding: 16,  // Ensure there's enough padding inside the button
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    marginTop: 'auto', // Align the button to the bottom (for flex layouts)
    shadowColor: '#FF00FF',  // Gradient border shadow effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,  // Shadow intensity
    shadowRadius: 10,  // Shadow radius for softer edges
    elevation: 5,  // Add elevation for android (shadow effect)
    width: '100%',  // Ensure the gradient fills the button's full width
  },

  payButtonText: {
    fontFamily: 'Rajdhani-SemiBold',  // Bold font for emphasis
    fontSize: 18,  // Adjusted font size for readability
    color: '#000',  // Black color for the text
    textAlign: 'center',  // Ensure text is centered
    fontWeight: 'bold',  // Bold text for better visibility
  }

});