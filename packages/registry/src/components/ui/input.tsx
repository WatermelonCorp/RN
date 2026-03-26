import * as React from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
    className?: string;
    variant?: 'default' | 'ghost';
};

function Input({ style, variant = 'default', editable = true, ...props }: InputProps) {
    return (
        <TextInput
            style={[
                styles.base,
                variant === 'ghost' ? styles.ghost : styles.default,
                editable === false ? styles.disabled : undefined,
                style,
            ]}
            editable={editable}
            placeholderTextColor="#71717a"
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: 8,
        color: '#09090b',
        fontSize: 14,
        minHeight: 40,
        paddingHorizontal: 12,
        paddingVertical: 10,
        width: '100%',
    },
    default: {
        backgroundColor: '#ffffff',
        borderColor: '#e4e4e7',
        borderWidth: 1,
    },
    ghost: {
        backgroundColor: '#f4f4f5',
        borderColor: 'transparent',
        borderWidth: 1,
    },
    disabled: {
        opacity: 0.5,
    },
});

export { Input };
export type { InputProps };
