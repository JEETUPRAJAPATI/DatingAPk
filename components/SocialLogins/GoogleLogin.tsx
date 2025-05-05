import { useEffect, useState } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import Toast from 'react-native-toast-message';
import * as WebBrowser from "expo-web-browser"

interface GoogleLoginButtonProps {
    onSuccess?: (provider: 'google', token: string) => void;
}

const WEB_CLIENT_ID = '117338106850-h4j0vc8vsc5tlubqcgvmc202qtto4fl6.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = '117338106850-vabo91up9moiqqa3i92qm8jmuerl055f.apps.googleusercontent.com';
const IOS_CLIENT_ID = 'YOUR_IOS_CLIENT_ID';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLoginButton({ onSuccess }: GoogleLoginButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: WEB_CLIENT_ID,
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,

    });

    useEffect(() => {
        if (response?.type === 'success') {
            const accessToken = response.authentication?.accessToken;
            if (accessToken) {
                fetchUserInfo(accessToken);
            }
        }
    }, [response]);

    const fetchUserInfo = async (token: string) => {
        try {
            setIsLoading(true);
            const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error('Failed to fetch user info');
            const user = await res.json();
            console.log('Google User Info:', user);
            onSuccess?.('google', token);
        } catch (error) {
            console.error('Google login error:', error);
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: 'Unable to fetch user info.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async () => {
        try {
            setIsLoading(true);
            await promptAsync();
        } catch (err) {
            console.error('Prompt error:', err);
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: 'Google login prompt failed.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // <Pressable style={styles.socialButton} onPress={handleLogin} disabled={isLoading}>
        <Pressable style={styles.socialButton} onPress={handleLogin} disabled={isLoading}>
            <FontAwesome name="google" size={29} color="#03d7fc" style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
        </Pressable>
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
        marginBottom: 24,
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
