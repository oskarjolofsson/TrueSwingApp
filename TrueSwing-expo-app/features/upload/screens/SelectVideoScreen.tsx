import { View, Text } from "react-native";
import { ScreenProps } from "./types";

export default function SelectVideoScreen({onBack, onNext}: ScreenProps) {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text className="text-2xl font-bold mb-4  text-white">Select Video Screen</Text>

            <View className="mt-8">
                <Text
                    className="text-white bg-blue-500 px-4 py-2 rounded-lg"
                    onPress={onNext}
                >
                    Next
                </Text>
            </View>
        </View>
    )
}