import { Pressable, Text, View } from "react-native";
import { useHomeAnalysis } from "features/home/context/HomeAnalysisContext";

import type { ScreenProps } from "features/shared/types";

export default function PracticeFlow({ onBack }: ScreenProps) {
    const { activeAnalysis } = useHomeAnalysis();

    const activeAnalysisLabel = activeAnalysis
        ? `${activeAnalysis.analysis_id} (${activeAnalysis.status})`
        : "none selected";

    return (
        <View className="flex-1 items-center justify-center bg-slate-950 px-6">
            <Text className="mb-6 text-center text-xl font-semibold text-white">
                Practice flow for analysis {activeAnalysisLabel}
            </Text>

            <Pressable
                onPress={onBack}
                className="rounded-xl bg-blue-600 px-6 py-3 active:bg-blue-500"
            >
                <Text className="text-base font-semibold text-white">
                    Go back
                </Text>
            </Pressable>
        </View>
    );
}