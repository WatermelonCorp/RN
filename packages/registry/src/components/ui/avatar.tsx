import * as React from 'react';
import { Image, StyleSheet, View, type ImageProps, type ViewProps } from 'react-native';

type AvatarProps = ViewProps & {
    alt?: string;
    className?: string;
};

type AvatarImageProps = ImageProps & {
    className?: string;
    src?: string;
};

type AvatarFallbackProps = ViewProps & {
    className?: string;
};

function getSizeStyle(className?: string) {
    if (!className) return undefined;
    if (className.includes('h-20') || className.includes('w-20')) return styles.size20;
    if (className.includes('h-16') || className.includes('w-16')) return styles.size16;
    if (className.includes('h-14') || className.includes('w-14')) return styles.size14;
    return undefined;
}

function Avatar({ className, style, ...props }: AvatarProps) {
    return <View style={[styles.base, getSizeStyle(className), style]} {...props} />;
}

function AvatarImage({ style, src, source, ...props }: AvatarImageProps) {
    return <Image style={[styles.image, style]} source={source ?? (src ? { uri: src } : undefined)} {...props} />;
}

function AvatarFallback({ style, ...props }: AvatarFallbackProps) {
    return <View style={[styles.fallback, style]} {...props} />;
}

const styles = StyleSheet.create({
    base: {
        borderRadius: 999,
        height: 40,
        overflow: 'hidden',
        width: 40,
    },
    image: {
        height: '100%',
        width: '100%',
    },
    fallback: {
        alignItems: 'center',
        backgroundColor: '#f4f4f5',
        flex: 1,
        justifyContent: 'center',
    },
    size14: {
        height: 56,
        width: 56,
    },
    size16: {
        height: 64,
        width: 64,
    },
    size20: {
        height: 80,
        width: 80,
    },
});

export { Avatar, AvatarFallback, AvatarImage };
export type { AvatarFallbackProps, AvatarImageProps, AvatarProps };
