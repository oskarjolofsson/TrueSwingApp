import { Pressable, Text, View } from "react-native";
import { ScreenProps } from "features/shared/types";

type Props = ScreenProps & {
    sessionId: string;
}

export default function DrillResultScreen() {

    return (
        <View className="flex-1 items-center justify-center bg-slate-950 px-6">
            <Text className="mb-6 text-center text-base text-slate-300">
                Practice session ended
            </Text>
        </View>
    )
}