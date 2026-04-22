import { Image, Pressable, StyleSheet, Text, View, Dimensions } from "react-native";
import { VideoView, type VideoSource } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Trash2, RotateCcw, Play, Pause, Undo } from "lucide-react-native";
import type { Analysis } from "features/analysis/types";
import { useCallback, useEffect } from "react";
import useAnalysisDrawing from "features/analysis/hooks/useAnalysisDrawing";
import useReelPlayback from "features/analysis/hooks/useReelPlayback";
import AnalysisDrawingOverlay from "features/analysis/components/AnalysisDrawingOverlay";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatePresence, MotiView } from "moti";

import VideoSeekBar from "./VideoSeekBar";

type Props = {
    analysis: Analysis;
    videoURL: string | null;
    isActive: boolean;
    onExit: () => void;
}

const { height } = Dimensions.get("window");

// Features remaining to implement
// - Scrubbing


export default function DetailedVideo({ analysis, videoURL, onExit, isActive }: Props) {
    const insets = useSafeAreaInsets();

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

    const drawingSource: VideoSource | null = videoURL;
    const drawPlayback = useReelPlayback({
        source: drawingSource,
        shouldPlay: isActive,
        muted: true,
        loop: false,
    });

    const closeDrawingMode = useCallback(() => {
        clearAllStrokes();
        onExit();
    }, [clearAllStrokes, onExit]);

    useEffect(() => {
        return () => {
            clearAllStrokes();
        };
    }, [clearAllStrokes]);

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

            <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
                <View style={{ position: "absolute", left: 8, right: 8, bottom: Math.max(insets.bottom + 45, 16), zIndex: 30, elevation: 30, }} >
                    <VideoSeekBar
                        currentTime={drawPlayback.currentTime}
                        duration={drawPlayback.duration}
                        isPlaying={drawPlayback.isPlaying}
                        onSeekStart={drawPlayback.beginScrub}
                        onSeekChange={(time) => drawPlayback.updateScrub(time, true)}
                        onSeekComplete={(time) => drawPlayback.endScrub(time)}
                        onPlayPause={drawPlayback.togglePlayPause}
                    />
                </View>
            </View>


            {/* Back button */}
            <View
                pointerEvents="box-none"
                style={{
                    position: "absolute",
                    top: Math.max(insets.top + 8, 16),
                    left: 20,
                    zIndex: 50,
                    elevation: 50,
                }}
            >
                <Pressable
                    onPress={closeDrawingMode}
                    hitSlop={10}
                    android_ripple={{ color: "rgba(255,255,255,0.12)", borderless: false }}
                    style={({ pressed }) => ({
                        alignSelf: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.22)",
                        backgroundColor: pressed ? "rgba(8,12,20,0.85)" : "rgba(8,12,20,0.62)",
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                        shadowColor: "#000",
                        shadowOpacity: 0.28,
                        shadowRadius: 14,
                        shadowOffset: { width: 0, height: 6 },
                    })}
                >
                    <View
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(255,255,255,0.12)",
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.18)",
                        }}
                    >
                        <ArrowLeft size={30} color="#E2E8F0" />
                    </View>

                </Pressable>
            </View>


            {/* Clear all Drawings */}
            <View
                pointerEvents="box-none"
                style={{
                    position: "absolute",
                    top: Math.max(insets.top + 8, 16),
                    right: 16,
                    zIndex: 50,
                    elevation: 50,
                }}
            >
                <Pressable
                    onPress={clearAllStrokes}
                    hitSlop={10}
                    android_ripple={{ color: "rgba(255,255,255,0.12)", borderless: false }}
                    style={({ pressed }) => ({
                        alignSelf: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.22)",
                        backgroundColor: pressed ? "rgba(8,12,20,0.85)" : "rgba(8,12,20,0.62)",
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                        shadowColor: "#000",
                        shadowOpacity: 0.28,
                        shadowRadius: 14,
                        shadowOffset: { width: 0, height: 6 },
                    })}
                >
                    <View
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 25,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(255,255,255,0.12)",
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.18)",
                        }}
                    >
                        <Trash2 size={20} color="#E2E8F0" />
                    </View>

                </Pressable>
            </View>

            {/* Take back latest stroke */}
            <View
                pointerEvents="box-none"
                style={{
                    position: "absolute",
                    top: Math.max(insets.top + 8, 16),
                    right: 66,
                    zIndex: 50,
                    elevation: 50,
                }}
            >
                <Pressable
                    onPress={undoLastStroke}
                    hitSlop={10}
                    android_ripple={{ color: "rgba(255,255,255,0.12)", borderless: false }}
                    style={({ pressed }) => ({
                        alignSelf: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.22)",
                        backgroundColor: pressed ? "rgba(8,12,20,0.85)" : "rgba(8,12,20,0.62)",
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                        shadowColor: "#000",
                        shadowOpacity: 0.28,
                        shadowRadius: 14,
                        shadowOffset: { width: 0, height: 6 },
                    })}
                >
                    <View
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 25,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgba(255,255,255,0.12)",
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.18)",
                        }}
                    >
                        <Undo size={20} color="#E2E8F0" />
                    </View>

                </Pressable>
            </View>




            {/* Play / Pause */}
            <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
                <View style={{
                    position: "absolute",
                    left: 8,
                    right: 8,
                    bottom: Math.max(insets.bottom + 95, 16),
                    zIndex: 30,
                    elevation: 30,
                    alignItems: "center",
                }} >
                    <Pressable
                        onPress={drawPlayback.togglePlayPause}
                        hitSlop={10}
                        android_ripple={{ color: "rgba(255,255,255,0.12)", borderless: false }}
                        style={({ pressed }) => ({
                            alignSelf: "center",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                            paddingHorizontal: 14,
                            paddingVertical: 10,
                            borderRadius: 999,
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.22)",
                            backgroundColor: pressed ? "rgba(8,12,20,0.85)" : "rgba(8,12,20,0.62)",
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                            shadowColor: "#000",
                            shadowOpacity: 0.28,
                            shadowRadius: 14,
                            shadowOffset: { width: 0, height: 6 },
                        })}
                    >
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 25,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "rgba(255,255,255,0.06)",
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.10)",
                            }}
                        >
                            <MotiView
                                key={drawPlayback.isPlaying ? "pause" : "play"}
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ type: "timing", duration: 120 }}
                            >
                                {drawPlayback.isPlaying ? (
                                    <Pause size={20} color="#E2E8F0" />
                                ) : (
                                    <Play size={20} color="#E2E8F0" fill="#E2E8F0" />
                                )}
                            </MotiView>
                        </View>

                    </Pressable>
                </View>
            </View>

        </View>
    )
}