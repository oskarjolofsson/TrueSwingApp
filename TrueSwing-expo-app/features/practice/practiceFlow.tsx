import { Text, View } from "react-native";
import { useHomeAnalysis } from "features/home/context/HomeAnalysisContext";

export default function PracticeFlow() {
    const { activeAnalysis } = useHomeAnalysis();
    const activeAnalysisLabel = activeAnalysis
        ? `${activeAnalysis.analysis_id} (${activeAnalysis.status})`
        : "none selected";

    return (
        <View style={{ flex: 1 }}>
            <Text>Practice flow for analysis {activeAnalysisLabel}</Text>
         </View>
    )
}