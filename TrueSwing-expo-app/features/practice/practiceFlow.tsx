import { Pressable, Text, View } from "react-native";
import { useHomeAnalysis } from "features/home/context/HomeAnalysisContext";
import type { PracticeSession } from "./types";
import { usePracticeScreenState } from "./hooks/usePracticeScreenState";
import type { Issue } from "features/issues/types";
import LoadingState from "features/shared/components/LoadingState";
import ErrorState from "features/shared/components/ErrorState";


type PracticeFlowProps = {
    onBack: () => void;
    selectedIssue: Issue;
};

export default function PracticeFlow({ onBack, selectedIssue }: PracticeFlowProps) {
    const { activeAnalysis } = useHomeAnalysis();
    const props = usePracticeScreenState(selectedIssue.id);

    if (!selectedIssue.id) return <ErrorState title="No issue selected for practice" buttonText={"Go back"} onRetry={onBack} />;
    if(!selectedIssue.analysis_issue_id) return <ErrorState title="You have not recieved this Issue to Practice on!" buttonText={"Go back"} onRetry={onBack} />;
    if (props.loading) return <LoadingState title="Loading practice session..." />;
    if (props.error) return <ErrorState title="Failed to load practice session" buttonText={"Go back"} onRetry={onBack} />;
    

    return (
        <View className="flex-1 items-center justify-center bg-slate-950 px-6">
            <Text className="mb-6 text-center text-xl font-semibold text-white">
                Practice flow for analysis {activeAnalysis?.analysis_id}
            </Text>

            <Text className="mb-6 text-center text-base text-slate-300">
                Selected AnalysisIssueId: {selectedIssue?.analysis_issue_id ?? "none selected"}
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