import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Image } from 'react-native';
import { Slider } from '@react-native-community/slider';

const { width, height } = Dimensions.get('window');

interface ComparisonOverlayProps {
    previousImageUri?: string;
}

export default function ComparisonOverlay({ previousImageUri }: ComparisonOverlayProps) {
    const [opacity, setOpacity] = useState(0.5);

    if (!previousImageUri) {
        return (
            <View style={styles.container}>
                <View style={styles.rectangle} />
                <View style={styles.instructionContainer}>
                    <Text style={styles.instructionText}>
                        Primera foto de seguimiento
                    </Text>
                    <Text style={styles.subText}>
                        Centra la herida en el marco
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: previousImageUri }}
                style={[styles.previousImage, { opacity }]}
                resizeMode="cover"
            />
            <View style={styles.rectangle} />

            <View style={styles.controlsContainer}>
                <Text style={styles.controlLabel}>Opacidad de referencia</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={opacity}
                    onValueChange={setOpacity}
                    minimumTrackTintColor="#00FF00"
                    maximumTrackTintColor="#FFFFFF"
                    thumbTintColor="#00FF00"
                />
            </View>

            <View style={styles.instructionContainer}>
                <Text style={styles.instructionText}>
                    Alinea con la foto anterior
                </Text>
                <Text style={styles.subText}>
                    Usa el control para ajustar la transparencia
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
    rectangle: {
        width: width * 0.7,
        height: width * 0.7,
        borderWidth: 3,
        borderColor: '#00FF00',
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    previousImage: {
        position: 'absolute',
        width: width,
        height: height,
    },
    controlsContainer: {
        position: 'absolute',
        top: 60,
        width: width * 0.8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
    },
    controlLabel: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    slider: {
        width: '100%',
        height: 40,
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
