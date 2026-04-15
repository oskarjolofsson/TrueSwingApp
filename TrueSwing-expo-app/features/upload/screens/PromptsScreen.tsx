import { View, Text } from "react-native";
import { ScreenProps } from "../types";
import { useEffect } from "react";
import type { Prompt } from "../types";
import type { UsePromptReturn } from "../hooks/usePrompt";

type Props = ScreenProps & {
    prompt: UsePromptReturn;
};

export default function PromptScreen({onBack, onNext, prompt}: Props) {


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text className="text-2xl font-bold mb-4  text-white">Prompt Screen</Text>
            <Text className="text-center text-gray-600 mb-8">
                
            </Text>

            <View className="absolute mt-8 flex-row space-x-4">
                <Text className="text-white bg-gray-500 px-4 py-2 rounded-lg" onPress={onBack}>
                    Previous
                </Text>
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