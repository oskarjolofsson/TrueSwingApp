
import { View, Text, Dimensions } from "react-native";
import type { Analysis } from "features/analysis/types";
import Reel from "features/analysis/components/Reel";
import useAnalysisData from "features/analysis/hooks/useAnalysisData";
import AnalysisService from "../services/analysisService";
import LoadingState from "features/shared/components/LoadingState";

export default function ReelContainer({
    analysis,
    isActive,
    refetch,
}: {
    analysis: Analysis;
    isActive: boolean;
    refetch: () => Promise<void>;
}) {
    const { videoURL, issues, activeIssue, setActiveIssue, loading } = useAnalysisData(analysis);

    if (loading) return <LoadingState title="Loading analysis details..." />;


    return (
        <Reel
            video_url={videoURL ?? null}
            analysis={analysis}
            issues={issues}
            active_issue={activeIssue}
            setActiveIssue={setActiveIssue}
            shouldPlay={isActive}
            onDelete={async () => {
                await AnalysisService.deleteAnalysis(analysis.analysis_id);
                refetch();
            }}
        />
    );
}