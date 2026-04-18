import { Pressable, Text, View } from "react-native";
import { Trash2 } from "lucide-react-native";

type AnalysisHeaderOverlayProps = {
    dateLabel?: string;
    onDeletePress: () => void;
    deleting?: boolean;
};

export default function AnalysisHeaderOverlay({
    dateLabel = "",
    onDeletePress,
    deleting = false,
}: AnalysisHeaderOverlayProps) {
    return (
        <View className="absolute top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/85 px-6 pt-20 pb-6">
            <View className="flex-row items-center justify-between gap-4">
                <Pressable
                    onPress={onDeletePress}
                    disabled={deleting}
                    className="flex-row items-center gap-3 rounded-lg bg-white/10 px-5 py-3 active:bg-white/20"
                    style={{ opacity: deleting ? 0.6 : 1 }}
                >
                    <Trash2 size={22} color="red" />
                    <Text className="text-base font-semibold text-white">
                        {deleting ? "Deleting..." : "Delete"}
                    </Text>
                </Pressable>

                <View className="flex-1 items-center">
                    <Text className="text-lg font-bold text-white">{dateLabel}</Text>
                </View>

                <View style={{ width: 104 }} />
            </View>
        </View>
    );
}
