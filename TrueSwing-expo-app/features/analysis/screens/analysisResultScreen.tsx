import { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react-native";
import InfoCard from "features/shared/components/InfoCard";
import useAnalysisData from "features/analysis/hooks/useAnalysisData";
import useAnalyses from "features/analysis/hooks/useAnalyses";
import type { Issue } from "features/issues/types";

const { width } = Dimensions.get("window");

export default function AnalysisResultScreen() {
    const listRef = useRef<FlatList>(null);
    const { setAnalysis, activeIssue, setActiveIssue, totalIssues, analysisError } = useAnalysisData();
    const { activeAnalysis, loading, error } = useAnalyses();

    // Connect the hooks: pass activeAnalysis to useAnalysisData
    useEffect(() => {
        if (activeAnalysis) {
            setAnalysis(activeAnalysis);
        }
    }, [activeAnalysis, setAnalysis]);

    // Update carousel position when activeIssue changes
    useEffect(() => {
        if (listRef.current && activeIssue >= 0) {
            listRef.current.scrollToIndex({ index: activeIssue, animated: true });
        }
    }, [activeIssue]);

    const goToIndex = (i: number) => {
        setActiveIssue(i);
    };

    const issues = activeAnalysis?.issues || [];

    

    const renderItem = ({ item }: { item: Issue }) => {
        return (
            <View style={{ width }} className="px-5">
                <View className="bg-[#111111] border border-white/10 rounded-[28px] p-6">

                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="px-4 py-1 rounded-full bg-white/5 border border-white/10">
                            <Text className="text-zinc-400 text-sm">
                                {item.phase ?? "General"}
                            </Text>
                        </View>

                        {item.confidence && (
                            <Text className="text-zinc-500 text-sm">
                                {Math.round(item.confidence * 100)}%
                            </Text>
                        )}
                    </View>

                    {/* Title */}
                    <Text className="text-white text-3xl font-bold mb-3">
                        {item.title}
                    </Text>

                    {/* Description */}
                    {item.description && (
                        <Text className="text-zinc-400 text-base mb-6 leading-6">
                            {item.description}
                        </Text>
                    )}

                    {/* Cards */}
                    <View className="gap-4">
                        {item.current_motion && (
                            <InfoCard
                                title="What’s happening"
                                text={item.current_motion}
                                color="yellow"
                            />
                        )}

                        {item.expected_motion && (
                            <InfoCard
                                title="What to feel instead"
                                text={item.expected_motion}
                                color="green"
                            />
                        )}
                    </View>

                    {/* Effects */}
                    {(item.swing_effect || item.shot_outcome) && (
                        <View className="mt-6 border-t border-white/10 pt-4">
                            {item.swing_effect && (
                                <Text className="text-zinc-400 mb-2">
                                    Effect: {item.swing_effect}
                                </Text>
                            )}
                            {item.shot_outcome && (
                                <Text className="text-zinc-400">
                                    Result: {item.shot_outcome}
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#050816] justify-center">

            {/* Progress */}
            <Text className="text-zinc-400 text-center mb-3">
                {activeIssue + 1} / {totalIssues}
            </Text>

            {/* Loading or error states */}
            {loading && <Text className="text-center text-zinc-400">Loading analysis...</Text>}
            {error && <Text className="text-center text-red-400">{error}</Text>}
            {analysisError && <Text className="text-center text-red-400">{analysisError}</Text>}

            {/* Carousel */}
            {issues.length > 0 && (
                <FlatList
                    ref={listRef}
                    data={issues}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    onMomentumScrollEnd={(e) => {
                        const i = Math.round(
                            e.nativeEvent.contentOffset.x / width
                        );
                        setActiveIssue(i);
                    }}
                    scrollEventThrottle={16}
                />
            )}

            {/* Navigation */}
            {issues.length > 0 && (
                <View className="flex-row justify-between px-6 mt-6">
                    <TouchableOpacity
                        disabled={activeIssue === 0}
                        onPress={() => goToIndex(activeIssue - 1)}
                        className="flex-row items-center bg-white/5 px-4 py-3 rounded-xl border border-white/10"
                    >
                        <ChevronLeft size={18} color="#fff" />
                        <Text className="text-white ml-2">Previous</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={activeIssue === issues.length - 1}
                        onPress={() => goToIndex(activeIssue + 1)}
                        className="flex-row items-center bg-white/5 px-4 py-3 rounded-xl border border-white/10"
                    >
                        <Text className="text-white mr-2">Next</Text>
                        <ChevronRight size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}