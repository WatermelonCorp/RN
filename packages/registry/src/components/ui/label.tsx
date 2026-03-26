import * as React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

type LabelProps = TextProps & {
    className?: string;
};

function Label({ style, ...props }: LabelProps) {
    return <Text style={[styles.label, style]} {...props} />;
}

const styles = StyleSheet.create({
    label: {
        color: '#09090b',
        fontSize: 14,
        fontWeight: '500',
    },
});

export { Label };
export type { LabelProps };
