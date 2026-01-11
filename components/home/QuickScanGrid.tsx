import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScanType } from '@/types/analysis';
import ModuleCard from '@/components/shared/ModuleCard';
import { useRouter } from 'expo-router';

interface QuickScanGridProps {
    onModulePress?: (scanType: ScanType) => void;
    onHelpPress?: (scanType: ScanType) => void;
}

export default function QuickScanGrid({
    onModulePress,
    onHelpPress,
}: QuickScanGridProps) {
    const router = useRouter();
    const modules: ScanType[] = ['skin', 'ocular', 'dental', 'posture', 'nails', 'wound'];

    // Only show first 2 modules on Home
    const displayedModules = modules.slice(0, 2);

    const handleModulePress = (scanType: ScanType) => {
        if (onModulePress) {
            onModulePress(scanType);
        }
    };

    const handleSeeAll = () => {
        router.push('/categories');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Especialidades</Text>
                <TouchableOpacity onPress={handleSeeAll}>
                    <Text style={styles.seeAllButton}>Ver todo</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {displayedModules.map((scanType) => (
                    <View key={scanType} style={styles.gridItem}>
                        <ModuleCard
                            scanType={scanType}
                            onPress={() => handleModulePress(scanType)}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginTop: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    seeAllButton: {
        fontSize: 15,
        fontWeight: '600',
        color: '#3B82F6',
    },
    grid: {
        gap: 0,
    },
    gridItem: {
        width: '100%',
    },
});
