import type { Issue } from "features/issues/types";

import { useState, useEffect, useRef } from "react";
import { FlatList, Text, View, StatusBar, Dimensions,SafeAreaView, TouchableOpacity } from "react-native";
import { useVideoPlayer, VideoView, VideoSource } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import TextBox from "features/shared/components/TextBox";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
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

    const currentIssue = issues[active_issue] ?? null;

    const source: VideoSource | null = video_url ? video_url : null;

    const player = useVideoPlayer(source, (playerInstance) => {
        playerInstance.loop = true;
        playerInstance.muted = true;
        playerInstance.play();
    });

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
            </View>

            {/* Issues */}
            <SafeAreaView className="flex-1 z-10" style={{ flex: 1, zIndex: 10 }}>
                <View className="flex-1 justify-end px-5 pb-8 pt-3 mb-12">

                    <View>
                        {currentIssue ? (
                            <View className="mb-5 rounded-[28px] border border-white/10 bg-black/35 p-5">
                                <Text className="mb-2 text-xs uppercase tracking-widest text-zinc-400">
                                    Issue {active_issue + 1} of {issues.length}
                                </Text>

                                <Text className="mb-3 text-3xl font-bold text-white">
                                    {currentIssue.title}
                                </Text>

                                {!!currentIssue.description && (
                                    <Text className="mb-3 text-base leading-6 text-zinc-200">
                                        {currentIssue.description}
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
                                            onPress={() => {}}
                                        />
                                    )}
                                />
                            </View>
                        )}

                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}