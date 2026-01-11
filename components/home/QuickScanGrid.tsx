import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScanType } from '@/types/analysis';
import ModuleCard from '@/components/shared/ModuleCard';

interface QuickScanGridProps {
    showAll?: boolean;
    onModulePress?: (scanType: ScanType) => void;
    onHelpPress?: (scanType: ScanType) => void;
}

export default function QuickScanGrid({
    showAll: initialShowAll = false,
    onModulePress,
    onHelpPress,
}: QuickScanGridProps) {
    const [showAll, setShowAll] = useState(initialShowAll);

    const modules: ScanType[] = ['skin', 'ocular', 'dental', 'posture', 'nails', 'wound'];
    const displayedModules = showAll ? modules : modules.slice(0, 2);

    const handleModulePress = (scanType: ScanType) => {
        if (onModulePress) {
            onModulePress(scanType);
        }
    };

    const handleHelpPress = (scanType: ScanType) => {
        if (onHelpPress) {
            onHelpPress(scanType);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Escaneos Rápidos</Text>
                <TouchableOpacity onPress={() => setShowAll(!showAll)}>
                    <Text style={styles.seeAllButton}>
                        {showAll ? 'Ver menos' : 'Ver todo'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.grid}>
                {displayedModules.map((scanType) => (
                    <View key={scanType} style={styles.gridItem}>
                        <ModuleCard
                            scanType={scanType}
                            onPress={() => handleModulePress(scanType)}
                            onHelpPress={() => handleHelpPress(scanType)}
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        marginBottom: 16,
    },
});
