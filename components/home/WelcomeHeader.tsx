import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WelcomeHeaderProps {
    userName?: string;
    onPressAvatar?: () => void;
}

export default function WelcomeHeader({ userName = 'Jonathan', onPressAvatar }: WelcomeHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.greeting}>Hola, {userName}</Text>
                <Text style={styles.subtitle}>¿Qué analizaremos hoy?</Text>
            </View>
            <TouchableOpacity
                style={styles.avatarContainer}
                onPress={onPressAvatar}
                activeOpacity={0.7}
            >
                <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={styles.avatar}
                >
                    <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
                </LinearGradient>
            </TouchableOpacity>
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
        fontSize: 26,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 22,
        marginTop: 2,
    },
    avatarContainer: {
        marginLeft: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
