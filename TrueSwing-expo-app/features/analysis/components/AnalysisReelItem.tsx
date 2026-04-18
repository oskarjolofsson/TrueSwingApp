import { useEffect } from "react";
import { Dimensions, View } from "react-native";

import type { Analysis } from "features/analysis/types";
import useAnalysisData from "features/analysis/hooks/useAnalysisData";
import Reel from "features/analysis/components/Reel";
import IssueShowcaseOverlay from "features/analysis/components/IssueShowcaseOverlay";

const { height } = Dimensions.get("window");

type AnalysisReelItemProps = {
    analysis: Analysis;
    isActive: boolean;
    activeIssueIndex: number;
    onActiveIssueChange: (index: number) => void;
    startPractice: (analysisIssueId: string) => void;
};

export default function AnalysisReelItem({
    analysis,
    isActive,
    activeIssueIndex,
    onActiveIssueChange,
    startPractice,
}: AnalysisReelItemProps) {
    const { videoURL, issues } = useAnalysisData(analysis);

    useEffect(() => {
        if (!issues.length && activeIssueIndex !== 0) {
            onActiveIssueChange(0);
            return;
        }

        if (issues.length && activeIssueIndex > issues.length - 1) {
            onActiveIssueChange(issues.length - 1);
        }
    }, [activeIssueIndex, issues.length, onActiveIssueChange]);

    return (
        <View style={{ height }} className="bg-black">
            <Reel
                video_url={videoURL ?? null}
                thumbnail_url={analysis.thumbnail_url}
                shouldPlay={isActive}
            />
            <IssueShowcaseOverlay
                issues={issues}
                activeIssueIndex={activeIssueIndex}
                onActiveIssueChange={onActiveIssueChange}
                startPractice={startPractice}
            />
        </View>
    );
}
