import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Dimensions, Image, View, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('screen'); // Use 'screen' for absolute total area

const CustomSplashScreen = ({ onFinish, startFade }) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (startFade) {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }).start(() => {
                if (onFinish) onFinish();
            });
        }
    }, [startFade, fadeAnim, onFinish]);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Image
                source={require('../../assets/splash-icon.png')}
                style={styles.image}
                resizeMode="cover"
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ffffff',
        zIndex: 99999,
        elevation: 99999,
    },
    image: {
        width: width,
        height: height + (StatusBar.currentHeight || 0), // Account for potential offsets
    },
});

export default CustomSplashScreen;
