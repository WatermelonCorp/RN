import * as React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

type SeparatorProps = ViewProps & {
    className?: string;
    decorative?: boolean;
    orientation?: 'horizontal' | 'vertical';
};

function Separator({ orientation = 'horizontal', style, ...props }: SeparatorProps) {
    return <View style={[styles.base, orientation === 'vertical' ? styles.vertical : styles.horizontal, style]} {...props} />;
}

const styles = StyleSheet.create({
    base: {
        backgroundColor: '#e4e4e7',
        flexShrink: 0,
    },
    horizontal: {
        height: StyleSheet.hairlineWidth,
        width: '100%',
    },
    vertical: {
        height: '100%',
        width: StyleSheet.hairlineWidth,
    },
});

export { Separator };
export type { SeparatorProps };
