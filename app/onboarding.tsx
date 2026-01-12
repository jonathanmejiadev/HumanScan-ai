import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, ChevronLeft, Heart, ShieldAlert, User as UserIcon, CheckCircle2 } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { UserService } from '@/services/userService';
import { UserProfile } from '@/types/user';

const STEPS = [
    { id: 1, title: 'Datos Básicos', icon: UserIcon },
    { id: 2, title: 'Condiciones', icon: Heart },
    { id: 3, title: 'Seguridad', icon: ShieldAlert },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [currentStep, setCurrentStep] = useState(1);

    // Form State
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState('');
    const [sexo, setSexo] = useState<'Masculino' | 'Femenino' | 'Otro'>('Otro');
    const [condiciones, setCondiciones] = useState<string>('');
    const [alergias, setAlergias] = useState<string>('');

    const handleNext = () => {
        if (currentStep === 1) {
            if (!nombre.trim() || !edad.trim()) {
                Alert.alert('Campos incompletos', 'Por favor ingresa tu nombre y edad.');
                return;
            }
        }
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            finishOnboarding();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const finishOnboarding = async () => {
        const profile: UserProfile = {
            nombre: nombre.trim(),
            edad: parseInt(edad),
            sexo,
            condiciones: condiciones.split(',').map(s => s.trim()).filter(s => s !== ''),
            alergias: alergias.split(',').map(s => s.trim()).filter(s => s !== ''),
            hasCompletedOnboarding: true,
        };

        await UserService.saveProfile(profile);
        router.replace('/(tabs)/(home)');
    };

    const renderStepIndicator = () => (
        <View style={styles.stepIndicatorContainer}>
            {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;

                return (
                    <React.Fragment key={step.id}>
                        <View style={styles.stepItem}>
                            <View style={[
                                styles.stepIconCircle,
                                isActive && styles.stepIconActive,
                                isCompleted && styles.stepIconCompleted
                            ]}>
                                <Icon size={18} color={isActive || isCompleted ? '#FFF' : Colors.textMuted} />
                            </View>
                            <Text style={[
                                styles.stepTitle,
                                isActive && styles.stepTitleActive
                            ]}>{step.title}</Text>
                        </View>
                        {index < STEPS.length - 1 && (
                            <View style={[
                                styles.stepLine,
                                isCompleted && styles.stepLineCompleted
                            ]} />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.welcomeText}>Bienvenido a HumanScan</Text>
                        <Text style={styles.subtitleText}>Personaliza tu experiencia para obtener mejores recomendaciones médicas.</Text>
                    </View>

                    {renderStepIndicator()}

                    <View style={styles.card}>
                        {currentStep === 1 && (
                            <View style={styles.stepContent}>
                                <Text style={styles.label}>¿Cómo te llamas?</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: Jonathan"
                                    value={nombre}
                                    onChangeText={setNombre}
                                    placeholderTextColor={Colors.textMuted}
                                />

                                <Text style={styles.label}>¿Cuántos años tienes?</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ej: 28"
                                    value={edad}
                                    onChangeText={setEdad}
                                    keyboardType="numeric"
                                    placeholderTextColor={Colors.textMuted}
                                />

                                <Text style={styles.label}>Sexo biológico</Text>
                                <View style={styles.radioContainer}>
                                    {(['Masculino', 'Femenino', 'Otro'] as const).map((s) => (
                                        <TouchableOpacity
                                            key={s}
                                            style={[styles.radioButton, sexo === s && styles.radioButtonActive]}
                                            onPress={() => setSexo(s)}
                                        >
                                            <Text style={[styles.radioLabel, sexo === s && styles.radioLabelActive]}>{s}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}

                        {currentStep === 2 && (
                            <View style={styles.stepContent}>
                                <View style={styles.infoBox}>
                                    <Heart size={20} color={Colors.primary} />
                                    <Text style={styles.infoText}>Conocer tus condiciones nos ayuda a filtrar alimentos o medicamentos que no sean óptimos para ti.</Text>
                                </View>
                                <Text style={styles.label}>Condiciones médicas crónicas</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Ej: Diabetes Tipo 2, Hipertensión (Separa por comas)"
                                    value={condiciones}
                                    onChangeText={setCondiciones}
                                    multiline
                                    numberOfLines={4}
                                    placeholderTextColor={Colors.textMuted}
                                />
                                <Text style={styles.helperText}>Ignora este paso si no tienes condiciones conocidas.</Text>
                            </View>
                        )}

                        {currentStep === 3 && (
                            <View style={styles.stepContent}>
                                <View style={[styles.infoBox, { backgroundColor: Colors.riskHighBg }]}>
                                    <ShieldAlert size={20} color={Colors.riskHigh} />
                                    <Text style={[styles.infoText, { color: Colors.riskEmergency }]}>
                                        Este paso es vital para tu seguridad. La IA te alertará si detecta algo a lo que seas alérgico.
                                    </Text>
                                </View>
                                <Text style={styles.label}>Alergias (Alimentos o Medicamentos)</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Ej: Penicilina, Glúten, Nueces (Separa por comas)"
                                    value={alergias}
                                    onChangeText={setAlergias}
                                    multiline
                                    numberOfLines={4}
                                    placeholderTextColor={Colors.textMuted}
                                />
                                <Text style={styles.helperText}>Indica cualquier alergia grave o restricción alimentaria.</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>

                <View style={[styles.footer, { paddingBottom: Math.max(20, insets.bottom) }]}>
                    <TouchableOpacity
                        style={[styles.backButton, currentStep === 1 && { opacity: 0 }]}
                        onPress={handleBack}
                        disabled={currentStep === 1}
                    >
                        <ChevronLeft size={20} color={Colors.textSecondary} />
                        <Text style={styles.backButtonText}>Atrás</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNext}
                    >
                        <Text style={styles.nextButtonText}>
                            {currentStep === 3 ? 'Comenzar' : 'Siguiente'}
                        </Text>
                        {currentStep === 3 ? (
                            <CheckCircle2 size={20} color="#FFF" />
                        ) : (
                            <ChevronRight size={20} color="#FFF" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 32,
        marginTop: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 16,
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    stepIndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        justifyContent: 'center',
    },
    stepItem: {
        alignItems: 'center',
        zIndex: 1,
    },
    stepIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.surfaceAlt,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.border,
    },
    stepIconActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    stepIconCompleted: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    stepTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.textMuted,
        marginTop: 6,
        position: 'absolute',
        top: 36,
        width: 80,
        textAlign: 'center',
    },
    stepTitleActive: {
        color: Colors.primary,
    },
    stepLine: {
        flex: 1,
        height: 2,
        backgroundColor: Colors.border,
        marginHorizontal: -15, // overlapping the items for a connected look
        marginTop: -20, // adjust to center vertically with circles
    },
    stepLineCompleted: {
        backgroundColor: Colors.secondary,
    },
    card: {
        backgroundColor: Colors.surface,
        padding: 24,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginTop: 30, // Space for step titles
    },
    stepContent: {
        minHeight: 260,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 12,
        marginTop: 4,
    },
    input: {
        backgroundColor: Colors.surfaceAlt,
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: Colors.text,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    radioContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    radioButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        backgroundColor: Colors.surface,
    },
    radioButtonActive: {
        backgroundColor: Colors.primary + '10', // 10% opacity primary
        borderColor: Colors.primary,
    },
    radioLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    radioLabelActive: {
        color: Colors.primary,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: Colors.infoBg,
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        gap: 12,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: Colors.info,
        lineHeight: 18,
        fontWeight: '500',
    },
    helperText: {
        fontSize: 13,
        color: Colors.textMuted,
        fontStyle: 'italic',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        backgroundColor: Colors.surface,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    nextButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
});
