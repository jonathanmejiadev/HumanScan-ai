import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface WelcomeHeaderProps {
    userName?: string;
}

export default function WelcomeHeader({ userName = 'Jonathan' }: WelcomeHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.greeting}>Hola, {userName}</Text>
                <Text style={styles.subtitle}>¿Qué analizaremos hoy?</Text>
            </View>
            <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    textContainer: {
        flex: 1,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
    },
    avatarContainer: {
        marginLeft: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
