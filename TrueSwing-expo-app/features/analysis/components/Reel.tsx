import type { Issue } from "features/issues/types";

import { useState, useEffect, useRef } from "react";
import { FlatList, Text, View, StatusBar, Dimensions, SafeAreaView, TouchableOpacity, Pressable } from "react-native";
import { useVideoPlayer, VideoView, VideoSource } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import TextBox from "features/shared/components/TextBox";
import { ChevronLeft, ChevronRight, Pause } from "lucide-react-native";
import IssuePill from "./IssuePill";

const { width, height } = Dimensions.get("window");

type ReelProps = {
    video_url: string | null
    issues: Issue[]
    active_issue: number
    setActiveIssue: (index: number) => void
}

export default function Reel({
    video_url,
    issues,
    active_issue,
    setActiveIssue,
}: ReelProps) {

    const [modalVisible, setModalVisible] = useState(false);
    const issueRailRef = useRef<FlatList<Issue>>(null);
    const issueCardsRef = useRef<FlatList<Issue>>(null);

    const currentIssue = issues[active_issue] ?? null;

    const source: VideoSource | null = video_url ? video_url : null;
    const [isPlaying, setIsPlaying] = useState(true);

    const player = useVideoPlayer(source, (playerInstance) => {
        playerInstance.loop = true;
        playerInstance.muted = true;
        playerInstance.play();
    });

    useEffect(() => {
        if (!player) return;

        // Set initial state
        setIsPlaying(player.playing);

        // Create a listener for when the playing state changes
        const subscription = player.addListener('playingChange', (event) => {
            setIsPlaying(event.isPlaying);
        });

        // Cleanup listener when component unmounts
        return () => {
            subscription.remove();
        };
    }, [player]);

    const goPrevIssue = () => {
        if (active_issue <= 0) return;
        const nextIndex = active_issue - 1;
        setActiveIssue(nextIndex);
        issueRailRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
            viewPosition: 0.5,
        });
    };

    const goNextIssue = () => {
        if (active_issue >= issues.length - 1) return;
        const nextIndex = active_issue + 1;
        setActiveIssue(nextIndex);
        issueRailRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
            viewPosition: 0.5,
        });
    };

    useEffect(() => {
        if (issues.length > 0) {
            issueCardsRef.current?.scrollToIndex({
                index: active_issue,
                animated: true,
            });
        }
    }, [active_issue, issues.length]);

    if (!source) {
        return (
            <TextBox header="No video available" text="An error occured while loading the video" />
        )
    }

    return (
        <View style={{ width, height }} className="bg-black">
            <StatusBar barStyle="light-content" />

            <View className="absolute inset-0">
                {video_url ? (
                    
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

                <Pressable
                    className="absolute inset-0 z-10"
                    onPress={() => {
                        if (player.playing) {
                            player.pause();
                        } else {
                            player.play();
                        }
                    }}
                />
            </View>

            {/* Issues */}
            <SafeAreaView className="flex-1 z-10" style={{ flex: 1, zIndex: 10 }} pointerEvents="box-none">
                <View className="flex-1 justify-end px-5 pb-8 pt-3 mb-12" pointerEvents="box-none">

                    <View pointerEvents="auto">
                        {issues.length > 0 ? (
                            <FlatList
                                ref={issueCardsRef}
                                data={issues}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id}
                                // This calculates which card is on screen when the swipe finishes
                                onMomentumScrollEnd={(e) => {
                                    const index = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
                                    if (index !== active_issue) {
                                        setActiveIssue(index);

                                        // Also scroll the bottom rail to match
                                        issueRailRef.current?.scrollToIndex({
                                            index,
                                            animated: true,
                                            viewPosition: 0.5,
                                        });
                                    }
                                }}
                                renderItem={({ item, index }) => (
                                    <View
                                        // width - 40 accounts for the 'px-5' (20px left + 20px right padding) on the parent view
                                        style={{ width: width - 35 }}
                                        className="mb-5 rounded-[28px] border border-white/10 bg-black/35 p-5"
                                    >
                                        <Text className="mb-2 text-xs uppercase tracking-widest text-zinc-400">
                                            Issue {index + 1} of {issues.length}
                                        </Text>

                                        <Text className="mb-3 text-3xl font-bold text-white">
                                            {item.title}
                                        </Text>

                                        {!!item.description && (
                                            <Text className="mb-3 text-base leading-6 text-zinc-200">
                                                {item.description}
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
                                )}
                            />
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

                                    <View className="flex-row items-center">
                                        <TouchableOpacity
                                            onPress={goPrevIssue}
                                            disabled={active_issue === 0}
                                            className={`mr-2 rounded-full border p-2 ${active_issue === 0
                                                ? "border-white/10 bg-black/15"
                                                : "border-white/20 bg-black/35"
                                                }`}
                                        >
                                            <ChevronLeft size={16} color="#fff" />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={goNextIssue}
                                            disabled={active_issue === issues.length - 1}
                                            className={`rounded-full border p-2 ${active_issue === issues.length - 1
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
                                            active={index === active_issue}
                                            onPress={() => { setActiveIssue(index);  }}
                                        />
                                    )}
                                />
                            </View>
                        )}

                    </View>
                </View>
            </SafeAreaView>

            {!isPlaying && (
                <View className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <View className="bg-black/30 rounded-full p-4 mb-40">
                        {/* If using lucide-react-native: */}
                        <Pause 
                            size={30} 
                            color="rgba(255, 255, 255, 0.6)" // 60% opacity for the outline
                            fill="transparent"               // Remove the solid white fill
                            strokeWidth={1.5}                // A thin outline
                        />
                        
                    </View>
                </View>
            )}
        </View>
    )
}