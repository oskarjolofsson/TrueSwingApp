import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    FlatList,
    Dimensions,
} from "react-native";
import ReelContainer from "features/analysis/components/ReelContainer";

import useAnalyses from "features/analysis/hooks/useAnalyses";
import LoadingState from "features/shared/components/LoadingState";
import ErrorState from "features/shared/components/ErrorState";
import TextBox from "features/shared/components/TextBox";
import InactiveAnalysisReel from "features/analysis/components/InActiveReel";

const { width, height } = Dimensions.get("window");

export default function AnalysisResultScreen() {
    const { allAnalyses, loading, error, refetch} = useAnalyses();
    const reelRef = useRef<FlatList>(null);
    const [activeAnalysisIndex, setActiveAnalysisIndex] = useState(0);

    // Refetch analyses when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [])
    );

    const syncActiveAnalysis = useCallback(
        (index: number) => {
            const analysis = allAnalyses[index];
            if (!analysis) return;
            if (index === activeAnalysisIndex) return;

            setActiveAnalysisIndex(index);
        },
        [allAnalyses, activeAnalysisIndex]
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

    if (!loading && error) {
         return <ErrorState title="Failed to load analysis" />;
    }

    if (!allAnalyses.length) {
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
                data={allAnalyses}
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
                                totalAnalyses={allAnalyses.length}
                            />
                        );
                    }

                    return (
                        <ReelContainer
                            analysis={item}
                            isActive={isActive}
                            refetch={refetch}
                        />
                    );
                }}
            />
        </View>
    );
}