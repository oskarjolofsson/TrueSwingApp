import { View, Text } from "react-native";
import { ScreenProps } from "./types";

export default function ProgressScreen({onBack, onNext}: ScreenProps) {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text className="text-2xl font-bold mb-4 text-white">Progress Screen</Text>

            <View className="mt-8 flex-row space-x-4">
                <Text className="text-white bg-gray-500 px-4 py-2 rounded-lg" onPress={onBack}>
                    Previous
                </Text>
            </View>
        </View>
    )
}