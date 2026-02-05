import { View, Text } from 'react-native';

export default function Index() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-2xl font-bold">🍉 Watermelon Test App</Text>
            <Text className="mt-4 text-gray-600">
                Run 'watermelon init' to get started
            </Text>
        </View>
    );
}
