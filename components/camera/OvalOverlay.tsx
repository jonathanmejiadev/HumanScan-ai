import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function OvalOverlay() {
    const ovalWidth = width * 0.75;
    const ovalHeight = width * 0.45;

    return (
        <View style={styles.container}>
            <Svg height={height} width={width} style={styles.svg}>
                <Ellipse
                    cx={width / 2}
                    cy={height / 2}
                    rx={ovalWidth / 2}
                    ry={ovalHeight / 2}
                    stroke="#00FF00"
                    strokeWidth="3"
                    fill="transparent"
                />
            </Svg>
            <View style={styles.instructionContainer}>
                <Text style={styles.instructionText}>
                    Centra tu boca en el óvalo
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    svg: {
        position: 'absolute',
    },
    instructionContainer: {
        position: 'absolute',
        bottom: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
    },
    instructionText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
