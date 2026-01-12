import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, Bot, User, ChevronRight, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { AIService, ChatMessage } from '@/services/aiService';
import { ScanType } from '@/types/analysis';
import { MODULES } from '@/constants/modules';

export default function ChatScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const params = useLocalSearchParams();

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeContext, setActiveContext] = useState<any>(null);
    const flatListRef = useRef<FlatList>(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (isInitialized.current) return;

        if (params.context && params.scanType) {
            isInitialized.current = true;
            try {
                const resultItems = JSON.parse(params.context as string);
                const type = params.scanType as string;
                setActiveContext({ result: resultItems, scanType: type });

                // Inyección de Contexto (Prompt Invisible)
                const contextTitle = getContextTitle(resultItems, type);
                const contextMsg = `Contexto: El usuario acaba de realizar un escaneo de tipo ${type}. Resultado detallado: ${params.context}. Responde saludando amigablemente y ofrece ayuda específica o aclaraciones sobre este análisis de ${contextTitle}.`;

                setIsLoading(true);
                AIService.sendMessage(contextMsg).then(response => {
                    setMessages(prev => [...prev, response]);
                    setIsLoading(false);
                }).catch(err => {
                    console.error('Error injecting context:', err);
                    setMessages([AIService.getInitialGreeting()]);
                    setIsLoading(false);
                });
            } catch (error) {
                console.error('Error parsing context:', error);
                setMessages([AIService.getInitialGreeting()]);
            }
        } else if (messages.length === 0) {
            isInitialized.current = true;
            setMessages([AIService.getInitialGreeting()]);
        }
    }, [params.context, params.scanType]);

    const getContextTitle = (result: any, scanType: string) => {
        switch (scanType) {
            case 'medication': return result.nombre_detectado;
            case 'nutrition': return result.nombre_plato;
            case 'lab_results': return result.tipo_estudio;
            default: return 'análisis reciente';
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            text: input.trim(),
            sender: 'user',
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await AIService.sendMessage(userMsg.text);
            setMessages(prev => [...prev, response]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModuleAction = (scanType: ScanType) => {
        router.push({ pathname: '/scan', params: { type: scanType } });
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isUser = item.sender === 'user';
        const module = item.relatedModule ? MODULES[item.relatedModule] : null;

        return (
            <View style={[
                styles.messageRow,
                isUser ? styles.userRow : styles.aiRow
            ]}>
                {!isUser && (
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Bot size={20} color="#FFFFFF" />
                        </View>
                    </View>
                )}

                <View style={[
                    styles.bubble,
                    isUser ? styles.userBubble : styles.aiBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isUser ? styles.userText : styles.aiText
                    ]}>
                        {item.text}
                    </Text>

                    {module && (
                        <TouchableOpacity
                            style={styles.suggestionCard}
                            onPress={() => handleModuleAction(item.relatedModule!)}
                        >
                            <View style={[styles.suggestionIcon, { backgroundColor: module.accentColor }]}>
                                {/* Icon placeholder logic could be expanded here */}
                                <Text style={styles.suggestionInitial}>{module.name[0]}</Text>
                            </View>
                            <View style={styles.suggestionContent}>
                                <Text style={styles.suggestionTitle}>Ir a {module.name}</Text>
                                <Text style={styles.suggestionSub}>Toque para iniciar</Text>
                            </View>
                            <ChevronRight size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>

                {isUser && (
                    <View style={[styles.avatarContainer, { marginLeft: 8, marginRight: 0 }]}>
                        <View style={[styles.avatar, { backgroundColor: '#1F2937' }]}>
                            <User size={20} color="#FFFFFF" />
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>HealthAI</Text>
                        <View style={styles.statusContainer}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>Asistente Online</Text>
                        </View>
                    </View>
                </View>

                {activeContext && (
                    <View style={styles.contextBanner}>
                        <View style={styles.contextInfo}>
                            <Bot size={16} color={Colors.skinScan} />
                            <Text style={styles.contextText} numberOfLines={1}>
                                Consultando sobre: {getContextTitle(activeContext.result, activeContext.scanType)}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => setActiveContext(null)} style={styles.clearContext}>
                            <X size={16} color={Colors.textMuted} />
                        </TouchableOpacity>
                    </View>
                )}

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />

                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#3B82F6" />
                        <Text style={styles.loadingText}>HealthAI está escribiendo...</Text>
                    </View>
                )}

                <View style={[styles.inputContainer, { paddingBottom: Math.max(20, insets.bottom) }]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escribe tu consulta..."
                        placeholderTextColor="#9CA3AF"
                        value={input}
                        onChangeText={setInput}
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (!input.trim() || isLoading) && styles.sendButtonDisabled
                        ]}
                        onPress={handleSend}
                        disabled={!input.trim() || isLoading}
                    >
                        <Send size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        marginRight: 16,
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
        marginRight: 4,
    },
    statusText: {
        fontSize: 12,
        color: '#10B981',
        fontWeight: '500',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 20,
        maxWidth: '100%',
    },
    userRow: {
        justifyContent: 'flex-end',
    },
    aiRow: {
        justifyContent: 'flex-start',
    },
    avatarContainer: {
        marginRight: 8,
        justifyContent: 'flex-end',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bubble: {
        padding: 16,
        borderRadius: 20,
        maxWidth: '80%',
    },
    aiBubble: {
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    userBubble: {
        backgroundColor: '#3B82F6',
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    aiText: {
        color: '#374151',
    },
    userText: {
        color: '#FFFFFF',
    },
    suggestionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 12,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    suggestionIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    suggestionInitial: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    suggestionContent: {
        flex: 1,
    },
    suggestionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    suggestionSub: {
        fontSize: 12,
        color: '#6B7280',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 8,
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 12,
        color: '#6B7280',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 24,
        paddingTop: 12,
        paddingBottom: 12,
        paddingHorizontal: 20,
        marginRight: 12,
        fontSize: 16,
        color: '#1F2937',
        maxHeight: 100,
    },
    sendButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#9CA3AF',
        opacity: 0.5,
    },
    contextBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.skinScanBg,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    contextInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    contextText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.skinScan,
    },
    clearContext: {
        padding: 4,
    },
});
