import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

interface LegalDisclaimerProps {
    text?: string;
}

export default function LegalDisclaimer({ text }: LegalDisclaimerProps) {
    const disclaimerText = text ||
        'Esta herramienta es solo informativa y no reemplaza la consulta médica profesional. En caso de emergencia, contacta a urgencias.';

    return (
        <View style={styles.container}>
            <AlertTriangle size={20} color="#F59E0B" style={styles.icon} />
            <Text style={styles.text}>{disclaimerText}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FEF3C7',
        borderWidth: 1,
        borderColor: '#F59E0B',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginVertical: 12,
        alignItems: 'flex-start',
    },
    icon: {
        marginRight: 12,
        marginTop: 2,
    },
    text: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
        color: '#92400E',
        fontWeight: '500',
    },
});
