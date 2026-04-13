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
import type { Issue } from "features/issues/types";
import LoadingState from "features/shared/components/LoadingState";
import ErrorState from "features/shared/components/ErrorState";
import TextBox from "features/shared/components/TextBox";

const { width, height } = Dimensions.get("window");

function IssuePill({
    label,
    active,
    onPress,
}: {
    label: string | null | undefined;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            className={`mr-2 rounded-full border px-4 py-2 ${active ? "border-white bg-white" : "border-white/20 bg-black/35"
                }`}
        >
            <Text
                numberOfLines={1}
                className={`text-sm font-medium ${active ? "text-black" : "text-white"
                    }`}
            >
                {label || "Unknown Issue"}
            </Text>
        </TouchableOpacity>
    );
}

function IssueModal({
    visible,
    issue,
    onClose,
}: {
    visible: boolean;
    issue: Issue | null;
    onClose: () => void;
}) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-end bg-black/70">
                <Pressable className="flex-1" onPress={onClose} />

                <View
                    className="rounded-t-[32px] border-t border-white/10 bg-[#0B0D12] px-6 pb-8 pt-5"
                    style={{ minHeight: height * 0.52 }}
                >
                    <View className="mb-5 flex-row items-center justify-between">
                        <View className="h-1.5 w-14 rounded-full bg-white/20" />
                        <TouchableOpacity
                            onPress={onClose}
                            className="rounded-full border border-white/10 bg-white/5 p-2"
                        >
                            <X size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {issue ? (
                        <>
                            <View className="mb-4 flex-row items-center justify-between">
                                <View className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                                    <Text className="text-xs text-zinc-300">
                                        {issue.phase ?? "General"}
                                    </Text>
                                </View>

                                {typeof issue.confidence === "number" && (
                                    <Text className="text-sm text-zinc-400">
                                        {Math.round(issue.confidence * 100)}%
                                    </Text>
                                )}
                            </View>

                            <Text className="mb-4 text-3xl font-bold text-white">
                                {issue.title}
                            </Text>

                            {!!issue.current_motion && (
                                <View className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <Text className="mb-2 text-xs uppercase tracking-widest text-zinc-400">
                                        What’s happening
                                    </Text>
                                    <Text className="text-base leading-6 text-zinc-100">
                                        {issue.current_motion}
                                    </Text>
                                </View>
                            )}

                            {!!issue.expected_motion && (
                                <View className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <Text className="mb-2 text-xs uppercase tracking-widest text-zinc-400">
                                        What to feel instead
                                    </Text>
                                    <Text className="text-base leading-6 text-zinc-100">
                                        {issue.expected_motion}
                                    </Text>
                                </View>
                            )}

                            <TouchableOpacity
                                activeOpacity={0.9}
                                className="mt-3 flex-row items-center justify-center rounded-2xl bg-white px-5 py-4"
                            >
                                <Dumbbell size={18} color="#000" />
                                <Text className="ml-2 text-base font-semibold text-black">
                                    Start practice
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <Text className="text-zinc-400">No issue selected.</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
}

function ActiveAnalysisReel({
    videoURL,
    issues,
    activeIssue,
    totalIssues,
    setActiveIssue,
    reelIndex,
    totalAnalyses,
}: {
    videoURL?: string | null;
    issues: Issue[];
    activeIssue: number;
    totalIssues: number;
    setActiveIssue: (index: number) => void;
    reelIndex: number;
    totalAnalyses: number;
}) {
    const [modalVisible, setModalVisible] = useState(false);
    const issueRailRef = useRef<FlatList<Issue>>(null);

    const currentIssue = issues[activeIssue] ?? null;

    const source: VideoSource | null = videoURL ? videoURL : null;

    const player = useVideoPlayer(source, (playerInstance) => {
        playerInstance.loop = true;
        playerInstance.muted = true;
        playerInstance.play();
    });

    const openIssue = (index: number) => {
        setActiveIssue(index);
        setModalVisible(true);
    };

    const goPrevIssue = () => {
        if (activeIssue <= 0) return;
        const nextIndex = activeIssue - 1;
        setActiveIssue(nextIndex);
        issueRailRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
            viewPosition: 0.5,
        });
    };

    const goNextIssue = () => {
        if (activeIssue >= issues.length - 1) return;
        const nextIndex = activeIssue + 1;
        setActiveIssue(nextIndex);
        issueRailRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
            viewPosition: 0.5,
        });
    };

    return (
        <View style={{ width, height }} className="bg-black">
            <StatusBar barStyle="light-content" />

            <View className="absolute inset-0">
                {videoURL ? (
                    <VideoView
                        player={player}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="contain"
                        nativeControls={false}
                        allowsFullscreen={false}
                    />
                ) : (
                    <View className="flex-1 items-center justify-center bg-[#0B0D12]">
                        <Text className="text-zinc-500">No video available</Text>
                    </View>
                )}

                <LinearGradient
                    colors={[
                        "rgba(0,0,0,0.55)",
                        "rgba(0,0,0,0.10)",
                        "rgba(0,0,0,0.58)",
                    ]}
                    locations={[0, 0.42, 1]}
                    style={{ position: "absolute", inset: 0 }}
                />
            </View>

            <SafeAreaView className="flex-1 z-10" style={{ flex: 1, zIndex: 10 }}>
                <View className="flex-1 justify-between px-5 pb-8 pt-3">
                    <View className="flex-row items-center justify-between">
                        <View className="rounded-full border border-white/10 bg-black/25 px-4 py-2">
                            <Text className="text-sm text-white">
                                Analysis {reelIndex + 1} / {totalAnalyses}
                            </Text>
                        </View>

                        <View className="rounded-full border border-white/10 bg-black/25 px-4 py-2">
                            <Text className="text-sm text-zinc-200">
                                {totalIssues} issue{totalIssues === 1 ? "" : "s"}
                            </Text>
                        </View>
                    </View>

                    <View>
                        {currentIssue ? (
                            <View className="mb-5 rounded-[28px] border border-white/10 bg-black/35 p-5">
                                <Text className="mb-2 text-xs uppercase tracking-widest text-zinc-400">
                                    Current issue
                                </Text>

                                <Text className="mb-3 text-3xl font-bold text-white">
                                    {currentIssue.title}
                                </Text>

                                {!!currentIssue.current_motion && (
                                    <Text className="mb-3 text-base leading-6 text-zinc-200">
                                        {currentIssue.current_motion}
                                    </Text>
                                )}

                                {!!currentIssue.expected_motion && (
                                    <Text className="text-base leading-6 text-zinc-300">
                                        {currentIssue.expected_motion}
                                    </Text>
                                )}

                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    className="mt-5 self-start rounded-2xl bg-white px-5 py-3"
                                >
                                    <Text className="font-semibold text-black">
                                        Start practice
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="mb-5 rounded-[28px] border border-white/10 bg-black/35 p-5">
                                <Text className="text-zinc-300">
                                    No issues found for this analysis.
                                </Text>
                            </View>
                        )}

                        {issues.length > 0 && (
                            <View className="mb-4">
                                <View className="mb-3 flex-row items-center justify-between">
                                    <Text className="text-sm font-medium text-zinc-200">
                                        Tap an issue
                                    </Text>

                                    <View className="flex-row items-center">
                                        <TouchableOpacity
                                            onPress={goPrevIssue}
                                            disabled={activeIssue === 0}
                                            className={`mr-2 rounded-full border p-2 ${activeIssue === 0
                                                    ? "border-white/10 bg-black/15"
                                                    : "border-white/20 bg-black/35"
                                                }`}
                                        >
                                            <ChevronLeft size={16} color="#fff" />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={goNextIssue}
                                            disabled={activeIssue === issues.length - 1}
                                            className={`rounded-full border p-2 ${activeIssue === issues.length - 1
                                                    ? "border-white/10 bg-black/15"
                                                    : "border-white/20 bg-black/35"
                                                }`}
                                        >
                                            <ChevronRight size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <FlatList
                                    ref={issueRailRef}
                                    data={issues}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(item) => item.id}
                                    contentContainerStyle={{ paddingRight: 12 }}
                                    renderItem={({ item, index }) => (
                                        <IssuePill
                                            label={item.title}
                                            active={index === activeIssue}
                                            onPress={() => openIssue(index)}
                                        />
                                    )}
                                />
                            </View>
                        )}

                        <Text className="text-sm text-zinc-300">
                            Swipe vertically for more analyses
                        </Text>
                    </View>
                </View>
            </SafeAreaView>

            <IssueModal
                visible={modalVisible}
                issue={currentIssue}
                onClose={() => setModalVisible(false)}
            />
        </View>
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
        setAnalysis,
        activeIssue,
        setActiveIssue,
        totalIssues,
        videoURL,
        analysisError,
    } = useAnalysisData();

    const {
        activeAnalysis,
        allAnalyses,
        setActiveAnalysisById,
        loading,
        error,
    } = useAnalyses();

    const reelRef = useRef<FlatList>(null);
    const [activeAnalysisIndex, setActiveAnalysisIndex] = useState(0);

    const analyses = useMemo(() => {
        if (allAnalyses?.length) return allAnalyses;
        if (activeAnalysis) return [activeAnalysis];
        return [];
    }, [allAnalyses, activeAnalysis]);

    const syncActiveAnalysis = useCallback(
        (index: number) => {
            const analysis = analyses[index];
            if (!analysis) return;

            // ADD THIS CHECK: Prevent loop if we are already on this index
            if (index === activeAnalysisIndex) return;

            setActiveAnalysisIndex(index);
            setActiveAnalysisById(analysis.analysis_id);
            setAnalysis(analysis);
            setActiveIssue(0);
        },
        [analyses, activeAnalysisIndex, setActiveAnalysisById, setAnalysis, setActiveIssue]
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

    useEffect(() => {
        console.log("Active analysis updated:", activeAnalysis?.analysis_id);
        console.log("Video URL:", videoURL);
        console.log("Issues:", activeAnalysis?.issues?.map((issue) => issue.title));
    }, [activeAnalysis, videoURL]);

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 80,
    }).current;

    if (loading) return <LoadingState title="Loading Analysis" subtitle="" />;

    if (error || analysisError) return <ErrorState title="Failed to load analysis" />;

    if (!analyses.length) {
        <TextBox
            header={"You have no analyses made yet"}
            text={"Upload a video to get your first swing analysis"}
            // ctaOnClick={() => navigate("/dashboard/upload")} 
            ctaText={"Create Analysis"}
        />
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
                    const isActive = index === activeAnalysisIndex;

                    if (!isActive) {
                        return (
                            <InactiveAnalysisReel
                                reelIndex={index}
                                totalAnalyses={analyses.length}
                            />
                        );
                    }

                    return (
                        <ActiveAnalysisReel
                            videoURL={videoURL}
                            issues={activeAnalysis?.issues || item.issues || []}
                            activeIssue={activeIssue}
                            totalIssues={totalIssues}
                            setActiveIssue={setActiveIssue}
                            reelIndex={index}
                            totalAnalyses={analyses.length}
                        />
                    );
                }}
            />
        </View>
    );
}