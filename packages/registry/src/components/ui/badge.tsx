import { TextStyleContext } from '@/registry/components/ui/text';
import * as React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

type BadgeProps = ViewProps & {
    className?: string;
    variant?: BadgeVariant;
};

function Badge({ style, variant = 'default', children, ...props }: BadgeProps) {
    return (
        <TextStyleContext.Provider value={[styles.textBase, getTextStyle(variant)]}>
            <View style={[styles.base, getContainerStyle(variant), style]} {...props}>
                {children}
            </View>
        </TextStyleContext.Provider>
    );
}

function getContainerStyle(variant: BadgeVariant) {
    switch (variant) {
        case 'secondary':
            return styles.secondary;
        case 'destructive':
            return styles.destructive;
        case 'outline':
            return styles.outline;
        default:
            return styles.default;
    }
}

function getTextStyle(variant: BadgeVariant) {
    switch (variant) {
        case 'secondary':
            return styles.secondaryText;
        case 'destructive':
            return styles.destructiveText;
        case 'outline':
            return styles.outlineText;
        default:
            return styles.defaultText;
    }
}

const styles = StyleSheet.create({
    base: {
        alignItems: 'center',
        borderRadius: 999,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    default: {
        backgroundColor: '#18181b',
        borderColor: 'transparent',
        borderWidth: 1,
    },
    secondary: {
        backgroundColor: '#f4f4f5',
        borderColor: 'transparent',
        borderWidth: 1,
    },
    destructive: {
        backgroundColor: '#ef4444',
        borderColor: 'transparent',
        borderWidth: 1,
    },
    outline: {
        backgroundColor: '#ffffff',
        borderColor: '#e4e4e7',
        borderWidth: 1,
    },
    textBase: {
        fontSize: 12,
        fontWeight: '600',
    },
    defaultText: {
        color: '#fafafa',
    },
    secondaryText: {
        color: '#18181b',
    },
    destructiveText: {
        color: '#fafafa',
    },
    outlineText: {
        color: '#18181b',
    },
});

export { Badge };
export type { BadgeProps };
