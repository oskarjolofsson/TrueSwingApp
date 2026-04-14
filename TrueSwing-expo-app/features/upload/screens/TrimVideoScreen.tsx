import { View, Text } from "react-native";
import { ScreenProps } from "./types";

export default function TrimScreen({onBack, onNext, videoUri, setVideoUri, removeVideo}: ScreenProps & { videoUri: string | null, setVideoUri: (uri: string | null) => void, removeVideo: () => void }) {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text className="text-2xl font-bold mb-4  text-white">Trim Video Screen, this is the video URI: {videoUri}</Text>

            <View className="mt-8 flex-row space-x-4">
                <Text className="text-white bg-gray-500 px-4 py-2 rounded-lg" onPress={() => {removeVideo(); onBack(); }}>
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