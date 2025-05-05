// SocialLoginButtons.tsx
import { View, Pressable, Text, Platform, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Facebook from 'expo-facebook';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

type SocialProvider = 'facebook' | 'apple';

interface SocialLoginButtonsProps {
    onSuccess?: (provider: SocialProvider, token: string) => void;
}

export default function SocialLoginButtons({ onSuccess }: SocialLoginButtonsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSocialLogin = async (provider: SocialProvider) => {
        setIsLoading(true);
        try {
            if (provider === 'facebook') {
                await Facebook.initializeAsync({ appId: 'YOUR_FACEBOOK_APP_ID' });
                const { type, token } = await Facebook.logInWithReadPermissionsAsync({
                    permissions: ['public_profile', 'email'],
                });
                if (type === 'success' && token) {
                    onSuccess?.('facebook', token);
                }
            } else if (provider === 'apple' && Platform.OS === 'ios') {
                const credential = await AppleAuthentication.signInAsync({
                    requestedScopes: [
                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                        AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    ],
                });
                onSuccess?.('apple', credential.identityToken ?? '');
            } else {
                console.log('Apple login is only available on iOS.');
            }
        } catch (error) {
            console.error('Social login error:', error);
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: 'Something went wrong!',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.socialButtons}>
            <Pressable
                style={styles.socialButton}
                onPress={() => handleSocialLogin('facebook')}
                disabled={isLoading}
            >
                <FontAwesome name="facebook" size={24} color="#03d7fc" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </Pressable>

            <Pressable
                style={styles.socialButton}
                onPress={() => handleSocialLogin('apple')}
                disabled={isLoading}
            >
                <FontAwesome name="apple" size={29} color="#03d7fc" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    socialButtons: {
        width: '100%',
        gap: 16,
        marginBottom: 24,
    },
    socialButton: {
        width: '100%',
        height: 56,
        flexDirection: 'row',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#03d7fc',
    },
    socialIcon: {
        marginRight: 12,
    },
    socialButtonText: {
        fontFamily: 'Rajdhani-SemiBold',
        fontSize: 18,
        color: '#03d7fc',
    },
});
