import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { OverlayType } from '@/types/analysis';
import OvalOverlay from './OvalOverlay';
import GridOverlay from './GridOverlay';
import ComparisonOverlay from './ComparisonOverlay';

const { width, height } = Dimensions.get('window');

interface CameraOverlayProps {
    type: OverlayType;
    previousImageUri?: string;
}

export default function CameraOverlay({ type, previousImageUri }: CameraOverlayProps) {
    const renderOverlay = () => {
        switch (type) {
            case 'oval':
                return <OvalOverlay />;
            case 'grid':
                return <GridOverlay />;
            case 'comparison':
                return <ComparisonOverlay previousImageUri={previousImageUri} />;
            case 'circle':
                return (
                    <View style={styles.circleContainer}>
                        <View style={styles.circle} />
                    </View>
                );
            case 'rectangle':
            default:
                return (
                    <View style={styles.rectangleContainer}>
                        <View style={styles.rectangle} />
                    </View>
                );
        }
    };

    return (
        <View style={styles.container} pointerEvents="none">
            {renderOverlay()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rectangleContainer: {
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
    circleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: width * 0.6,
        height: width * 0.6,
        borderWidth: 3,
        borderColor: '#00FF00',
        borderRadius: width * 0.3,
        backgroundColor: 'transparent',
    },
});
