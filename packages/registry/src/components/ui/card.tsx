import * as React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

type CardProps = ViewProps & {
    className?: string;
};

function Card({ style, ...props }: CardProps) {
    return <View style={[styles.card, style]} {...props} />;
}

function CardHeader({ style, ...props }: CardProps) {
    return <View style={[styles.header, style]} {...props} />;
}

function CardContent({ style, ...props }: CardProps) {
    return <View style={[styles.content, style]} {...props} />;
}

function CardFooter({ style, ...props }: CardProps) {
    return <View style={[styles.footer, style]} {...props} />;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderColor: '#e4e4e7',
        borderRadius: 16,
        borderWidth: 1,
    },
    header: {
        gap: 6,
        padding: 24,
    },
    content: {
        paddingBottom: 24,
        paddingHorizontal: 24,
    },
    footer: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 24,
        paddingHorizontal: 24,
        paddingTop: 0,
    },
});

export { Card, CardContent, CardFooter, CardHeader };
export type { CardProps };
