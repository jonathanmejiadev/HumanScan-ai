import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { LEGAL_DISCLAIMER } from '@/constants/modules';

export default function MedicalDisclaimer() {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <AlertTriangle size={20} color="#D97706" strokeWidth={2.5} />
            </View>
            <Text style={styles.text}>{LEGAL_DISCLAIMER}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FEF3C7',
        borderWidth: 1,
        borderColor: '#FCD34D',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 20,
        marginVertical: 16,
    },
    iconContainer: {
        marginRight: 12,
        marginTop: 2,
    },
    text: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
        color: '#92400E',
        fontWeight: '600',
    },
});
