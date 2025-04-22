// components/GradientInput.tsx

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

type GradientInputProps = {
    children: React.ReactNode;
    style?: ViewStyle;
};

const GradientInput = ({ children, style }: GradientInputProps) => {
    return (
        <LinearGradient
            colors={['#FF00FF', '#8000FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientBorder, style]}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientBorder: {
        padding: 2,
        borderRadius: 24,
        marginBottom: 16,
    },
});

export default GradientInput;
