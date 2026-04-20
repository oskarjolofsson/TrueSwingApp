import { useEffect } from "react";
import { Dimensions, View, Pressable } from "react-native";

import type { Analysis } from "features/analysis/types";
import useAnalysisData from "features/analysis/hooks/useAnalysisData";
import Reel from "features/analysis/components/Reel";
import IssueShowcaseOverlay from "features/analysis/components/IssueShowcaseOverlay";
import { Issue } from "features/issues/types";
import { Ruler } from "lucide-react-native";
import { StyleSheet } from "react-native";

const { height } = Dimensions.get("window");

type AnalysisReelItemProps = {
    analysis: Analysis;
    isActive: boolean;
    activeIssueIndex: number;
    onActiveIssueChange: (index: number) => void;
    startPractice: (activeIssue: Issue) => void;
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

            <View
                pointerEvents="box-none"
                style={StyleSheet.absoluteFill}
            >
                <Pressable
                    onPress={() => console.log("Open video details")}
                    style={{
                        position: "absolute",
                        right: 16,
                        top: "42%",
                        width: 48,
                        height: 48,
                        marginTop: -24,
                        zIndex: 999,
                        elevation: 999,
                        borderColor: "rgba(255,255,255,0.1)",
                        borderWidth: 2,
                        borderRadius: 999,
                    }}
                >
                    {({ pressed }) => (
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 999,
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.1)",
                                backgroundColor: pressed
                                    ? "rgba(0,0,0,0.8)"
                                    : "rgba(0,0,0,0.6)",
                                transform: [{ scale: pressed ? 0.95 : 1 }],
                            }}
                        >
                            <Ruler size={20} color="white" />
                        </View>
                    )}
                </Pressable>
            </View>

        </View>
    );
}
