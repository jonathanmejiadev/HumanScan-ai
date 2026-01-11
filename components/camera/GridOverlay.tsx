import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, { Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function GridOverlay() {
    const centerX = width / 2;
    const gridSpacing = width / 6;

    return (
        <View style={styles.container}>
            <Svg height={height} width={width} style={styles.svg}>
                {/* Vertical center line */}
                <Line
                    x1={centerX}
                    y1={0}
                    x2={centerX}
                    y2={height}
                    stroke="#00FF00"
                    strokeWidth="3"
                    strokeDasharray="10, 5"
                />

                {/* Horizontal reference lines */}
                {/* Shoulders */}
                <Line
                    x1={0}
                    y1={height * 0.25}
                    x2={width}
                    y2={height * 0.25}
                    stroke="#00FF00"
                    strokeWidth="2"
                    strokeDasharray="5, 5"
                    opacity={0.6}
                />

                {/* Hips */}
                <Line
                    x1={0}
                    y1={height * 0.45}
                    x2={width}
                    y2={height * 0.45}
                    stroke="#00FF00"
                    strokeWidth="2"
                    strokeDasharray="5, 5"
                    opacity={0.6}
                />

                {/* Knees */}
                <Line
                    x1={0}
                    y1={height * 0.7}
                    x2={width}
                    y2={height * 0.7}
                    stroke="#00FF00"
                    strokeWidth="2"
                    strokeDasharray="5, 5"
                    opacity={0.6}
                />
            </Svg>

            <View style={styles.instructionContainer}>
                <Text style={styles.instructionText}>
                    Alinea tu cuerpo con las guías
                </Text>
                <Text style={styles.subText}>
                    Hombros • Cadera • Rodillas
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
    subText: {
        color: '#CCCCCC',
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
    },
});
