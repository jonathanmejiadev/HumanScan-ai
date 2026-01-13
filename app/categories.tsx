import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MODULES } from '@/constants/modules';
import { ScanType } from '@/types/analysis';
import ModuleCard from '@/components/shared/ModuleCard';

export default function AllCategoriesScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const modules: ScanType[] = [
        'skin', 'ocular', 'dental', 'posture', 'nails', 'wound',
        'capillary', 'throat', 'veins', 'pediatrics', 'intimate', 'bites'
    ];

    const handleModulePress = (scanType: ScanType) => {
        router.push({ pathname: '/scan', params: { type: scanType } });
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Especialidades</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={modules}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <ModuleCard
                        scanType={item}
                        onPress={() => handleModulePress(item)}
                        fullDescription={true}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
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
        backgroundColor: '#F9FAFB',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
});
