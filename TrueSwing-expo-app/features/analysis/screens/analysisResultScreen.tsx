import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
    View,
    FlatList,
    Dimensions,
} from "react-native";

import useAnalyses from "features/analysis/hooks/useAnalyses";
import LoadingState from "features/shared/components/LoadingState";
import ErrorState from "features/shared/components/ErrorState";
import TextBox from "features/shared/components/TextBox";
import InactiveAnalysisReel from "features/analysis/components/InActiveReel";
import AnalysisHeaderOverlay from "features/analysis/components/AnalysisHeaderOverlay";
import DeleteConfirmation from "features/analysis/components/DeleteConfirmation";
import AnalysisService from "features/analysis/services/analysisService";
import AnalysisReelItem from "features/analysis/components/AnalysisReelItem";

const { height } = Dimensions.get("window");

export default function AnalysisResultScreen() {
    const { allAnalyses, loading, error, refetch } = useAnalyses();
    const reelRef = useRef<FlatList>(null);
    const [activeAnalysisIndex, setActiveAnalysisIndex] = useState(0);
    const [issueIndexByAnalysisId, setIssueIndexByAnalysisId] = useState<Record<string, number>>({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const activeAnalysis = allAnalyses[activeAnalysisIndex] ?? null;
    const activeAnalysisId = activeAnalysis?.analysis_id;

    // Refetch analyses when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [])
    );

    useEffect(() => {
        if (!allAnalyses.length) {
            setActiveAnalysisIndex(0);
            return;
        }

        if (activeAnalysisIndex > allAnalyses.length - 1) {
            setActiveAnalysisIndex(allAnalyses.length - 1);
        }
    }, [allAnalyses.length, activeAnalysisIndex]);

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

    const handleActiveIssueChange = useCallback(
        (analysisId: string, index: number) => {
            setIssueIndexByAnalysisId((previous) => ({
                ...previous,
                [analysisId]: index,
            }));
        },
        []
    );

    const handleDeleteActiveAnalysis = useCallback(async () => {
        if (!activeAnalysisId) return;

        setIsDeleting(true);
        try {
            await AnalysisService.deleteAnalysis(activeAnalysisId);

            setIssueIndexByAnalysisId((previous) => {
                const next = { ...previous };
                delete next[activeAnalysisId];
                return next;
            });

            await refetch();
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    }, [activeAnalysisId, refetch]);

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
                        <AnalysisReelItem
                            analysis={item}
                            isActive={isActive}
                            activeIssueIndex={issueIndexByAnalysisId[item.analysis_id] ?? 0}
                            onActiveIssueChange={(nextIssueIndex) =>
                                handleActiveIssueChange(item.analysis_id, nextIssueIndex)
                            }
                        />
                    );
                }}
            />

            {activeAnalysis ? (
                <AnalysisHeaderOverlay
                    dateLabel={activeAnalysis.created_at ? new Date(activeAnalysis.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    deleting={isDeleting}
                    onDeletePress={() => setShowDeleteConfirm(true)}
                />
            ) : null}

            <DeleteConfirmation
                visible={showDeleteConfirm}
                isLoading={isDeleting}
                onConfirm={handleDeleteActiveAnalysis}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </View>
    );
}