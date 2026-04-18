
import type { Issue } from "features/issues/types";
import { usePracticeScreenState } from "features/practice/hooks/usePracticeScreenState";
import { Pressable, Text, View } from "react-native";
import LoadingState from "features/shared/components/LoadingState";
import ErrorState from "features/shared/components/ErrorState";
import type { ScreenProps } from "features/shared/types";

type Props = ScreenProps & {
    issue: Issue;
}

// OnNext in this case is to go to the result screen
export default function DrillPracticeScreen({ issue, onNext }: Props ) {
    const props = usePracticeScreenState(issue.id);

    if (props.loading) return <LoadingState title="Loading practice session..." />;
    if (props.error) return <ErrorState title="Failed to load practice session" buttonText={"End Practice Session"} onRetry={onNext} />;
    

    return (
        <View className="flex-1 items-center justify-center bg-slate-950 px-6">

            <Text className="mb-6 text-center text-base text-slate-300">
                Selected AnalysisIssueId: {issue?.analysis_issue_id ?? "none selected"}
            </Text>

            <Pressable
                onPress={() => {onNext()}}
                className="rounded-xl bg-blue-600 px-6 py-3 active:bg-blue-500"
            >
                <Text className="text-base font-semibold text-white">
                    End Practice Session
                </Text>
            </Pressable>
        </View>
    );

}