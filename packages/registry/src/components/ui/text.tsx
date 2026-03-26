import * as Slot from '@rn-primitives/slot';
import * as React from 'react';
import {
    Platform,
    StyleSheet,
    Text as RNText,
    type Role,
    type StyleProp,
    type TextStyle,
} from 'react-native';

type TextVariant =
    | 'default'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'p'
    | 'blockquote'
    | 'code'
    | 'lead'
    | 'large'
    | 'small'
    | 'muted';

type TextProps = React.ComponentProps<typeof RNText> &
    React.RefAttributes<RNText> & {
        asChild?: boolean;
        className?: string;
        variant?: TextVariant;
    };

const ROLE: Partial<Record<TextVariant, Role>> = {
    h1: 'heading',
    h2: 'heading',
    h3: 'heading',
    h4: 'heading',
    blockquote: Platform.select({ web: 'blockquote' as Role }),
    code: Platform.select({ web: 'code' as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
    h1: '1',
    h2: '2',
    h3: '3',
    h4: '4',
};

const TextStyleContext = React.createContext<StyleProp<TextStyle> | undefined>(undefined);

function getVariantStyle(variant: TextVariant): StyleProp<TextStyle> {
    switch (variant) {
        case 'h1':
            return styles.h1;
        case 'h2':
            return styles.h2;
        case 'h3':
            return styles.h3;
        case 'h4':
            return styles.h4;
        case 'p':
            return styles.p;
        case 'blockquote':
            return styles.blockquote;
        case 'code':
            return styles.code;
        case 'lead':
            return styles.lead;
        case 'large':
            return styles.large;
        case 'small':
            return styles.small;
        case 'muted':
            return styles.muted;
        default:
            return styles.default;
    }
}

function Text({ style, asChild = false, variant = 'default', ...props }: TextProps) {
    const inheritedStyle = React.useContext(TextStyleContext);
    const Component = asChild ? Slot.Text : RNText;

    return (
        <Component
            style={[styles.base, getVariantStyle(variant), inheritedStyle, style]}
            role={ROLE[variant]}
            aria-level={ARIA_LEVEL[variant]}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    base: {
        color: '#09090b',
        fontSize: 16,
    },
    default: {},
    h1: {
        fontSize: 36,
        fontWeight: '800',
        lineHeight: 40,
    },
    h2: {
        fontSize: 30,
        fontWeight: '700',
        lineHeight: 34,
        paddingBottom: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e4e4e7',
    },
    h3: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 28,
    },
    h4: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 24,
    },
    p: {
        lineHeight: 24,
    },
    blockquote: {
        borderLeftWidth: 3,
        borderLeftColor: '#e4e4e7',
        fontStyle: 'italic',
        paddingLeft: 12,
    },
    code: {
        backgroundColor: '#f4f4f5',
        borderRadius: 6,
        fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
        fontSize: 13,
        fontWeight: '600',
        overflow: 'hidden',
        paddingHorizontal: 6,
        paddingVertical: 4,
    },
    lead: {
        color: '#71717a',
        fontSize: 20,
        lineHeight: 28,
    },
    large: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 24,
    },
    small: {
        fontSize: 14,
        fontWeight: '500',
    },
    muted: {
        color: '#71717a',
        fontSize: 14,
        lineHeight: 20,
    },
});

export { Text, TextStyleContext };
