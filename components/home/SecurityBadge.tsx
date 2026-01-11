import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shield } from 'lucide-react-native';

export default function SecurityBadge() {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Shield size={14} color="#10B981" strokeWidth={2.5} />
            </View>
            <Text style={styles.text}>Seguro y Encriptado</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#A7F3D0',
        flexShrink: 1,
    },
    iconContainer: {
        marginRight: 6,
    },
    text: {
        fontSize: 11,
        fontWeight: '600',
        color: '#047857',
        letterSpacing: 0.2,
    },
});
