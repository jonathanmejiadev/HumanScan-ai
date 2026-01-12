import React from 'react';
import { LucideProps, Camera, Eye, Smile, User, Hand, Activity, Scan, Baby, ShieldAlert, Bug, Pill, MessageSquare } from 'lucide-react-native';
import { ScanType } from '@/types/analysis';
import { MODULES } from '@/constants/modules';

const iconMap: Record<string, any> = {
    camera: Camera,
    eye: Eye,
    smile: Smile,
    user: User,
    hand: Hand,
    activity: Activity,
    scan: Scan,
    baby: Baby,
    'shield-alert': ShieldAlert,
    bug: Bug,
    pill: Pill,
    'message-square': MessageSquare,
};

interface CategoryIconProps extends LucideProps {
    scanType: ScanType;
}

export default function CategoryIcon({ scanType, ...props }: CategoryIconProps) {
    const module = MODULES[scanType];
    const IconComponent = iconMap[module?.icon] || Scan;
    return <IconComponent {...props} />;
}
