import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ArrowLeft,
    Save,
    User as UserIcon,
    Heart,
    ShieldAlert,
    Calendar,
    ChevronDown
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { UserService } from '@/services/userService';
import { UserProfile } from '@/types/user';

export default function ProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState('');
    const [sexo, setSexo] = useState<'Masculino' | 'Femenino' | 'Otro'>('Otro');
    const [condiciones, setCondiciones] = useState('');
    const [alergias, setAlergias] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await UserService.getProfile();
            if (data) {
                setProfile(data);
                setNombre(data.nombre);
                setEdad(data.edad.toString());
                setSexo(data.sexo);
                setCondiciones(data.condiciones.join(', '));
                setAlergias(data.alergias.join(', '));
            }
        } catch (e) {
            console.error('Error loading profile:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!nombre.trim() || !edad.trim()) {
            Alert.alert('Error', 'El nombre y la edad son obligatorios.');
            return;
        }

        setSaving(true);
        try {
            const updatedProfile: UserProfile = {
                nombre: nombre.trim(),
                edad: parseInt(edad),
                sexo,
                condiciones: condiciones.split(',').map(s => s.trim()).filter(s => s !== ''),
                alergias: alergias.split(',').map(s => s.trim()).filter(s => s !== ''),
                hasCompletedOnboarding: true,
            };

            await UserService.saveProfile(updatedProfile);
            Alert.alert('Éxito', 'Perfil actualizado correctamente.');
            router.back();
        } catch (e) {
            console.error('Error saving profile:', e);
            Alert.alert('Error', 'No se pudo guardar el perfil.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi Perfil de Salud</Text>
                <TouchableOpacity
                    style={[styles.saveButton, saving && { opacity: 0.7 }]}
                    onPress={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color={Colors.primary} />
                    ) : (
                        <Save size={22} color={Colors.primary} />
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.profileCard}>
                        <View style={styles.avatarLarge}>
                            <Text style={styles.avatarLargeText}>{nombre.charAt(0)}</Text>
                        </View>
                        <Text style={styles.profileName}>{nombre || 'Usuario'}</Text>
                        <Text style={styles.profileStatus}>Perfil de Salud Activo</Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <UserIcon size={20} color={Colors.primary} />
                            <Text style={styles.sectionTitle}>DATOS PERSONALES</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nombre completo</Text>
                            <TextInput
                                style={styles.input}
                                value={nombre}
                                onChangeText={setNombre}
                                placeholder="Tu nombre"
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                                <Text style={styles.label}>Edad</Text>
                                <TextInput
                                    style={styles.input}
                                    value={edad}
                                    onChangeText={setEdad}
                                    keyboardType="numeric"
                                    placeholder="25"
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1.5 }]}>
                                <Text style={styles.label}>Sexo biológico</Text>
                                <View style={styles.sexSelector}>
                                    {(['Masculino', 'Femenino', 'Otro'] as const).map((s) => (
                                        <TouchableOpacity
                                            key={s}
                                            style={[styles.sexOption, sexo === s && styles.sexOptionActive]}
                                            onPress={() => setSexo(s)}
                                        >
                                            <Text style={[styles.sexLabel, sexo === s && styles.sexLabelActive]}>
                                                {s.charAt(0)}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Heart size={20} color={Colors.secondary} />
                            <Text style={styles.sectionTitle}>CONDICIONES MÉDICAS</Text>
                        </View>
                        <Text style={styles.description}>
                            Esto ayuda a la IA a filtrar componentes que podrían afectar tus condiciones crónicas.
                        </Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={condiciones}
                            onChangeText={setCondiciones}
                            placeholder="Ej: Diabetes, Hipertensión (Separa por comas)"
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <ShieldAlert size={20} color={Colors.riskHigh} />
                            <Text style={[styles.sectionTitle, { color: Colors.riskHigh }]}>ALERGIAS CRÍTICAS</Text>
                        </View>
                        <Text style={styles.description}>
                            La IA lanzará advertencias de ALTO RIESGO si detecta estos elementos en tus escaneos.
                        </Text>
                        <TextInput
                            style={[styles.input, styles.textArea, styles.alertInput]}
                            value={alergias}
                            onChangeText={setAlergias}
                            placeholder="Ej: Penicilina, Glúten, Nueces (Separa por comas)"
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    <TouchableOpacity style={styles.mainSaveButton} onPress={handleSave} disabled={saving}>
                        {saving ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Save size={20} color="#FFF" />
                                <Text style={styles.mainSaveButtonText}>Guardar Cambios</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    saveButton: {
        padding: 8,
        marginRight: -8,
    },
    scrollContent: {
        padding: 20,
    },
    profileCard: {
        alignItems: 'center',
        paddingBottom: 24,
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    avatarLargeText: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFF',
    },
    profileName: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
    },
    profileStatus: {
        fontSize: 14,
        color: Colors.secondary,
        fontWeight: '600',
    },
    section: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.textMuted,
        letterSpacing: 1,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.surfaceAlt,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: Colors.text,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    row: {
        flexDirection: 'row',
    },
    sexSelector: {
        flexDirection: 'row',
        backgroundColor: Colors.surfaceAlt,
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    sexOption: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    sexOptionActive: {
        backgroundColor: Colors.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    sexLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textMuted,
    },
    sexLabelActive: {
        color: Colors.primary,
    },
    description: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginBottom: 12,
        lineHeight: 18,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    alertInput: {
        borderColor: Colors.riskHigh + '40',
        backgroundColor: Colors.riskHighBg + '20',
    },
    mainSaveButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 10,
        marginTop: 10,
    },
    mainSaveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
