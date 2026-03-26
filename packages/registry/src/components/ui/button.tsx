import { TextStyleContext } from '@/registry/components/ui/text';
import * as React from 'react';
import {
    Pressable,
    StyleSheet,
    View,
    type PressableProps,
    type StyleProp,
    type TextStyle,
    type ViewStyle,
} from 'react-native';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

type ButtonProps = Omit<PressableProps, 'children'> &
    {
        children?: React.ReactNode;
        className?: string;
        variant?: ButtonVariant;
        size?: ButtonSize;
    };

function getButtonStyle(variant: ButtonVariant): StyleProp<ViewStyle> {
    switch (variant) {
        case 'destructive':
            return styles.destructiveButton;
        case 'outline':
            return styles.outlineButton;
        case 'secondary':
            return styles.secondaryButton;
        case 'ghost':
            return styles.ghostButton;
        case 'link':
            return styles.linkButton;
        default:
            return styles.defaultButton;
    }
}

function getButtonTextStyle(variant: ButtonVariant): StyleProp<TextStyle> {
    switch (variant) {
        case 'destructive':
            return styles.destructiveText;
        case 'outline':
            return styles.outlineText;
        case 'secondary':
            return styles.secondaryText;
        case 'ghost':
            return styles.ghostText;
        case 'link':
            return styles.linkText;
        default:
            return styles.defaultText;
    }
}

function getSizeStyle(size: ButtonSize): StyleProp<ViewStyle> {
    switch (size) {
        case 'sm':
            return styles.smButton;
        case 'lg':
            return styles.lgButton;
        case 'icon':
            return styles.iconButton;
        default:
            return styles.mdButton;
    }
}

function Button({ style, variant = 'default', size = 'default', disabled, children, ...props }: ButtonProps) {
    const resolvedStyle = style as StyleProp<ViewStyle>;

    return (
        <Pressable disabled={disabled} role="button" style={resolvedStyle} {...props}>
            {({ pressed }) => (
                <TextStyleContext.Provider value={[styles.buttonTextBase, getButtonTextStyle(variant)]}>
                    <View
                        style={[
                            styles.baseButton,
                            getButtonStyle(variant),
                            getSizeStyle(size),
                            pressed && variant !== 'link' ? styles.pressed : undefined,
                            disabled ? styles.disabled : undefined,
                        ]}
                    >
                        {children}
                    </View>
                </TextStyleContext.Provider>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    baseButton: {
        alignItems: 'center',
        borderRadius: 8,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
    },
    defaultButton: {
        backgroundColor: '#18181b',
    },
    destructiveButton: {
        backgroundColor: '#ef4444',
    },
    outlineButton: {
        backgroundColor: '#ffffff',
        borderColor: '#e4e4e7',
        borderWidth: 1,
    },
    secondaryButton: {
        backgroundColor: '#f4f4f5',
    },
    ghostButton: {
        backgroundColor: 'transparent',
    },
    linkButton: {
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    mdButton: {
        minHeight: 40,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    smButton: {
        minHeight: 36,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    lgButton: {
        minHeight: 44,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    iconButton: {
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 0,
        width: 40,
    },
    pressed: {
        opacity: 0.9,
    },
    disabled: {
        opacity: 0.5,
    },
    buttonTextBase: {
        fontSize: 14,
        fontWeight: '600',
    },
    defaultText: {
        color: '#fafafa',
    },
    destructiveText: {
        color: '#fafafa',
    },
    outlineText: {
        color: '#18181b',
    },
    secondaryText: {
        color: '#18181b',
    },
    ghostText: {
        color: '#18181b',
    },
    linkText: {
        color: '#18181b',
        textDecorationLine: 'underline',
    },
});

export { Button };
export type { ButtonProps };
