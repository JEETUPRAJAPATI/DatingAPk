import { LinearGradient } from "expo-linear-gradient";

const GradientInput = ({ children }: { children: React.ReactNode }) => (
    <LinearGradient
        colors={['#FF00FF', '#8000FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
    >
        {children}
    </LinearGradient>
);

gradientBorder: {
    padding: 2, // border thickness
        borderRadius: 24,
            marginBottom: 16,
  },
inputInner: {
    height: 48,
        backgroundColor: '#000',
            borderRadius: 22,
                paddingHorizontal: 16,
                    color: '#FFF',
                        fontFamily: 'Rajdhani',
                            justifyContent: 'center',
  },
