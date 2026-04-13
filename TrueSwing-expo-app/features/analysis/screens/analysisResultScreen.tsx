import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Modal,
    Pressable,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoView, VideoSource } from "expo-video";
import {
    ChevronLeft,
    ChevronRight,
    X,
    Dumbbell,
} from "lucide-react-native";

import useAnalysisData from "features/analysis/hooks/useAnalysisData";
import useAnalyses from "features/analysis/hooks/useAnalyses";
import LoadingState from "features/shared/components/LoadingState";
import ErrorState from "features/shared/components/ErrorState";
import TextBox from "features/shared/components/TextBox";
import Reel from "features/analysis/components/Reel";
import type { Analysis } from "features/analysis/types";

const { width, height } = Dimensions.get("window");

function ReelContainer({
    analysis,
    isActive,
}: {
    analysis: Analysis;
    isActive: boolean;
}) {
    const { videoURL, issues, activeIssue, setActiveIssue, loading } = useAnalysisData(analysis);

    if (loading) {
        return (
            <View style={{ width, height }} className="bg-black justify-center items-center">
                <Text className="text-white">Loading analysis details...</Text>
            </View>
        );
    }

    return (
        <Reel
            video_url={videoURL ?? null}
            issues={issues}
            active_issue={activeIssue}
            setActiveIssue={setActiveIssue}
            shouldPlay={isActive}
        />
    );
}

function InactiveAnalysisReel({
    reelIndex,
    totalAnalyses,
}: {
    reelIndex: number;
    totalAnalyses: number;
}) {
    return (
        <View style={{ width, height }} className="bg-black">
            <LinearGradient
                colors={["#050816", "#0B0D12", "#050816"]}
                style={{ position: "absolute", inset: 0 }}
            />

            <SafeAreaView className="flex-1" style={{ flex: 1 }}>
                <View className="flex-1 justify-between px-5 pb-8 pt-3">
                    <View className="flex-row items-center justify-between">
                        <View className="rounded-full border border-white/10 bg-black/25 px-4 py-2">
                            <Text className="text-sm text-white">
                                Analysis {reelIndex + 1} / {totalAnalyses}
                            </Text>
                        </View>
                    </View>

                    <View className="rounded-[28px] border border-white/10 bg-black/35 p-5">
                        <Text className="text-zinc-300">
                            Swipe to load this analysis
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

export default function AnalysisResultScreen() {
    const {
        allAnalyses,
        loading,
        error,
    } = useAnalyses();

    const reelRef = useRef<FlatList>(null);
    const [activeAnalysisIndex, setActiveAnalysisIndex] = useState(0);

    const analyses = allAnalyses;

    const syncActiveAnalysis = useCallback(
        (index: number) => {
            const analysis = analyses[index];
            if (!analysis) return;
            if (index === activeAnalysisIndex) return;

            setActiveAnalysisIndex(index);
        },
        [analyses, activeAnalysisIndex]
    );

    const syncActiveAnalysisRef = useRef(syncActiveAnalysis);
    useEffect(() => {
        syncActiveAnalysisRef.current = syncActiveAnalysis;
    }, [syncActiveAnalysis]);

    const onViewableItemsChanged = useRef(
        ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
            const firstVisible = viewableItems?.[0]?.index;
            if (typeof firstVisible === "number") {
                syncActiveAnalysisRef.current(firstVisible);
            }
        }
    ).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 80,
    }).current;

    const isReady = allAnalyses.length > 0;
    const isInitialLoad = loading && !isReady;

    if (isInitialLoad) return <LoadingState title="Loading Analysis" subtitle="" />;

    // Only show error if we aren't loading, or if we have a hard error on load
    if (!loading && error) {
         return <ErrorState title="Failed to load analysis" />;
    }
    if (!analyses.length) {
        return (
            <TextBox
                header={"You have no analyses made yet"}
                text={"Upload a video to get your first swing analysis"}
                ctaText={"Create Analysis"}
            />
        );
    }

    return (
        <View className="flex-1 bg-black">
            <FlatList
                ref={reelRef}
                data={analyses}
                keyExtractor={(item) => item.analysis_id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={height}
                snapToAlignment="start"
                disableIntervalMomentum
                getItemLayout={(_, index) => ({
                    length: height,
                    offset: height * index,
                    index,
                })}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                renderItem={({ item, index }) => {
                    const shouldRender = Math.abs(index - activeAnalysisIndex) <= 1;
                    const isActive = index === activeAnalysisIndex;

                    if (!shouldRender) {
                        return (
                            <InactiveAnalysisReel
                                reelIndex={index}
                                totalAnalyses={analyses.length}
                            />
                        );
                    }

                    return (
                        <ReelContainer
                            analysis={item}
                            isActive={isActive}
                        />
                    );
                }}
            />
        </View>
    );
}