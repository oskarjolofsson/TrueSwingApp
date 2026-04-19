import { Pressable, Text, View } from "react-native";
import { useHomeAnalysis } from "features/home/context/HomeAnalysisContext";
import type { Issue } from "features/issues/types";
import ErrorState from "features/shared/components/ErrorState";
import DrillPracticeScreen from "./screens/drillPracticeScreen";
import DrillResultScreen from "./screens/drillResultScreen";
import { useScreenSequence } from "features/shared/hooks/useScreenState";
import type { PracticeSession } from "./types";


type PracticeFlowProps = {
    onBack: () => void;
    selectedIssue: Issue;
    selectedSession: PracticeSession | null;
};

export default function PracticeFlow({ onBack, selectedIssue, selectedSession }: PracticeFlowProps) {
    const Screens = ['Practice', 'Result'];
    const { activeAnalysis } = useHomeAnalysis();
    const drillScreenSequenceProps = useScreenSequence({ screens: Screens });


    if (!selectedIssue.id) return <ErrorState title="No issue selected for practice" buttonText={"Go back"} onRetry={onBack} />;
    if(!selectedIssue.analysis_issue_id) return <ErrorState title="You have not recieved this Issue to Practice on!" buttonText={"Go back"} onRetry={onBack} />;
    if(!selectedSession) return <ErrorState title="No active session found for this practice run" buttonText={"Go back"} onRetry={onBack} />;

    return (
        <View style={{ flex: 1 }}>
            {drillScreenSequenceProps.currentScreen === 'Practice' && (
                <DrillPracticeScreen
                    issue={selectedIssue}
                    session={selectedSession}
                    onNext={() => drillScreenSequenceProps.next()}
                    onBack={() => {}}
                />
            )}
            {drillScreenSequenceProps.currentScreen === 'Result' && (
                <DrillResultScreen />
            )}
        </View>
    );
}