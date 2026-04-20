import { useCallback, useEffect, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { type VideoSource, VideoView } from "expo-video";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Analysis } from "features/analysis/types";
import useAnalysisData from "features/analysis/hooks/useAnalysisData";
import Reel from "features/analysis/components/Reel";
import IssueShowcaseOverlay from "features/analysis/components/IssueShowcaseOverlay";
import { Issue } from "features/issues/types";
import { ArrowLeft, Pause, Play, Ruler, RotateCcw, Trash2 } from "lucide-react-native";
import AnalysisDrawingOverlay from "features/analysis/components/AnalysisDrawingOverlay";
import useAnalysisDrawing from "features/analysis/hooks/useAnalysisDrawing";
import useReelPlayback from "features/analysis/hooks/useReelPlayback";

const { height } = Dimensions.get("window");

type AnalysisReelItemProps = {
    analysis: Analysis;
    isActive: boolean;
    isDrawingMode: boolean;
    onDrawingModeChange: (isDrawingMode: boolean) => void;
    activeIssueIndex: number;
    onActiveIssueChange: (index: number) => void;
    startPractice: (activeIssue: Issue) => void;
};

export default function AnalysisReelItem({
    analysis,
    isActive,
    isDrawingMode,
    onDrawingModeChange,
    activeIssueIndex,
    onActiveIssueChange,
    startPractice,
}: AnalysisReelItemProps) {
    const insets = useSafeAreaInsets();
    const { videoURL, issues } = useAnalysisData(analysis);
    const [scrubberWidth, setScrubberWidth] = useState(0);
    const {
        strokes,
        activeStroke,
        hasStrokes,
        beginStroke,
        extendStroke,
        commitStroke,
        undoLastStroke,
        clearAllStrokes,
    } = useAnalysisDrawing();

    const drawingSource: VideoSource | null = isDrawingMode && videoURL ? videoURL : null;
    const drawPlayback = useReelPlayback({
        source: drawingSource,
        shouldPlay: isActive && isDrawingMode,
        muted: true,
        loop: false,
    });

    const openDrawingMode = useCallback(() => {
        clearAllStrokes();
        onDrawingModeChange(true);
    }, [clearAllStrokes, onDrawingModeChange]);

    const closeDrawingMode = useCallback(() => {
        onDrawingModeChange(false);
        clearAllStrokes();
    }, [clearAllStrokes, onDrawingModeChange]);

    const handleScrubAtX = useCallback(
        (locationX: number) => {
            if (scrubberWidth <= 0) return;
            const ratio = Math.max(0, Math.min(1, locationX / scrubberWidth));
            drawPlayback.updateScrubByRatio(ratio);
        },
        [drawPlayback, scrubberWidth]
    );

    useEffect(() => {
        if (!isDrawingMode) {
            clearAllStrokes();
        }
    }, [clearAllStrokes, isDrawingMode]);

    useEffect(() => {
        if (!issues.length && activeIssueIndex !== 0) {
            onActiveIssueChange(0);
            return;
        }

        if (issues.length && activeIssueIndex > issues.length - 1) {
            onActiveIssueChange(issues.length - 1);
        }
    }, [activeIssueIndex, issues.length, onActiveIssueChange]);

    if (isDrawingMode) {
        return (
            <View style={{ height }} className="bg-black">
                <View style={StyleSheet.absoluteFill}>
                    {analysis.thumbnail_url ? (
                        <>
                            <Image
                                source={{ uri: analysis.thumbnail_url }}
                                style={StyleSheet.absoluteFill}
                                blurRadius={28}
                                resizeMode="cover"
                            />
                            <View
                                style={{
                                    ...StyleSheet.absoluteFillObject,
                                    backgroundColor: "rgba(0, 0, 0, 0.15)",
                                }}
                            />
                        </>
                    ) : null}

                    {drawPlayback.player ? (
                        <VideoView
                            player={drawPlayback.player}
                            style={StyleSheet.absoluteFill}
                            contentFit="contain"
                            nativeControls={false}
                            fullscreenOptions={{ enable: false }}
                        />
                    ) : (
                        <View className="flex-1 items-center justify-center bg-[#0B0D12]">
                            <Text className="text-zinc-500">No video available</Text>
                        </View>
                    )}

                    <LinearGradient
                        colors={[
                            "rgba(0,0,0,0.28)",
                            "rgba(0,0,0,0.05)",
                            "rgba(0,0,0,0.65)",
                        ]}
                        locations={[0, 0.45, 1]}
                        style={StyleSheet.absoluteFill}
                    />
                </View>

                <AnalysisDrawingOverlay
                    strokes={strokes}
                    activeStroke={activeStroke}
                    onStrokeStart={beginStroke}
                    onStrokeMove={extendStroke}
                    onStrokeEnd={commitStroke}
                />

                <View pointerEvents="box-none" style={StyleSheet.absoluteFill} className="mb-10">
                    <View
                        className="absolute left-4 right-4 rounded-[18px] border border-white/15 bg-black/80 px-3 pb-2.5 pt-2.5"
                        style={{
                            bottom: Math.max(insets.bottom + 8, 16),
                        }}
                    >
                        <View className="mb-2.5 flex-row items-center justify-between">
                            <View className="flex-row" style={{ gap: 8 }}>
                                <Pressable
                                    onPress={closeDrawingMode}
                                    className="flex-row items-center border border-white/20 px-3"
                                    style={({ pressed }) => ({
                                        height: 38,
                                        borderRadius: 999,
                                        backgroundColor: pressed
                                            ? "rgba(0,0,0,0.75)"
                                            : "rgba(0,0,0,0.45)",
                                        gap: 6,
                                    })}
                                >
                                    <ArrowLeft size={14} color="white" />
                                    <Text className="text-[13px] font-semibold text-white">
                                        Back
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={undoLastStroke}
                                    disabled={!strokes.length}
                                    className="items-center justify-center border border-white/20"
                                    style={({ pressed }) => ({
                                        width: 38,
                                        height: 38,
                                        borderRadius: 999,
                                        backgroundColor: pressed
                                            ? "rgba(0,0,0,0.75)"
                                            : "rgba(0,0,0,0.45)",
                                        opacity: strokes.length ? 1 : 0.45,
                                    })}
                                >
                                    <RotateCcw size={16} color="white" />
                                </Pressable>

                                <Pressable
                                    onPress={clearAllStrokes}
                                    disabled={!hasStrokes}
                                    className="items-center justify-center border border-white/20"
                                    style={({ pressed }) => ({
                                        width: 38,
                                        height: 38,
                                        borderRadius: 999,
                                        backgroundColor: pressed
                                            ? "rgba(0,0,0,0.75)"
                                            : "rgba(0,0,0,0.45)",
                                        opacity: hasStrokes ? 1 : 0.45,
                                    })}
                                >
                                    <Trash2 size={16} color="white" />
                                </Pressable>
                            </View>

                            <Pressable
                                onPress={drawPlayback.togglePlayPause}
                                className="items-center justify-center border border-white/20"
                                style={({ pressed }) => ({
                                    width: 38,
                                    height: 38,
                                    borderRadius: 999,
                                    backgroundColor: pressed
                                        ? "rgba(0,0,0,0.75)"
                                        : "rgba(0,0,0,0.45)",
                                })}
                            >
                                {drawPlayback.isPlaying ? (
                                    <Pause size={16} color="white" />
                                ) : (
                                    <Play size={16} color="white" />
                                )}
                            </Pressable>
                        </View>

                        <View className="flex-row items-center" style={{ gap: 10 }}>
                            <Text className="w-[42px] text-xs text-white/90">
                                {drawPlayback.currentTimeLabel}
                            </Text>

                            <View
                                className="h-[26px] flex-1 justify-center"
                                onLayout={(event) => {
                                    setScrubberWidth(event.nativeEvent.layout.width);
                                }}
                                onStartShouldSetResponder={() => true}
                                onMoveShouldSetResponder={() => true}
                                onResponderGrant={(event) => {
                                    drawPlayback.beginScrub();
                                    handleScrubAtX(event.nativeEvent.locationX);
                                }}
                                onResponderMove={(event) => {
                                    handleScrubAtX(event.nativeEvent.locationX);
                                }}
                                onResponderRelease={() => {
                                    drawPlayback.endScrub();
                                }}
                                onResponderTerminate={() => {
                                    drawPlayback.endScrub();
                                }}
                            >
                                <View
                                    className="h-1.5 rounded-full bg-white/20"
                                >
                                    <View
                                        style={{
                                            width: `${drawPlayback.progress * 100}%`,
                                            height: "100%",
                                            borderRadius: 999,
                                            backgroundColor: "rgba(86, 230, 167, 0.95)",
                                        }}
                                    />
                                </View>

                                <View
                                    className="absolute h-3 w-3 rounded-full bg-white"
                                    style={{
                                        left: `${drawPlayback.progress * 100}%`,
                                        transform: [{ translateX: -6 }],
                                    }}
                                />
                            </View>

                            <Text className="w-[42px] text-right text-xs text-white/90">
                                {drawPlayback.durationLabel}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

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
                    onPress={openDrawingMode}
                    className="absolute h-12 w-12 rounded-full border-2 border-white/10"
                    style={{
                        right: 16,
                        top: "42%",
                        marginTop: -24,
                        zIndex: 999,
                        elevation: 999,
                    }}
                >
                    {({ pressed }) => (
                        <View
                            className="flex-1 items-center justify-center rounded-full border border-white/10"
                            style={{
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
