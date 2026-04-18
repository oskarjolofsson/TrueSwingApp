import { useScreenSequence } from "features/shared/hooks/useScreenState";
import AnalysisResultScreen from "features/analysis/screens/analysisResultScreen";
import PracticeFlow from "features/practice/practiceFlow";
import useHomeAnalysisController from "features/home/hooks/useHomeAnalysisController";
import { HomeAnalysisProvider } from "features/home/context/HomeAnalysisContext";
import type { Issue } from "features/issues/types";

import { useFocusEffect } from '@react-navigation/native';
import { View } from "react-native";
import React from "react";


const allScreens = ['Analysis', 'Practice'];

export default function HomeFlow() {
    const { currentScreen, next, prev, goTo, } = useScreenSequence({ screens: allScreens });
    const analysisController = useHomeAnalysisController();
    const [selectedIssue, setSelectedIssue] = React.useState<Issue | null>(null);

    // Reset the flow in case use navigates away from this tab and comes back
    useFocusEffect(
        React.useCallback(() => {
            console.log("Resetting upload flow state");
            goTo('Analysis');
            setSelectedIssue(null);
            analysisController.refetch();
        }, [analysisController.refetch, goTo])
    )
    
    return (
        <HomeAnalysisProvider value={analysisController}>
            <View style={{ flex: 1 }}>
                {currentScreen === 'Analysis' && (
                    <AnalysisResultScreen
                        onNext={(issue) => {
                            setSelectedIssue(issue);
                            goTo('Practice');
                        }}
                    />
                )}
                {currentScreen === 'Practice' && (
                    <PracticeFlow
                        onBack={() => goTo('Analysis')}
                        selectedIssue={selectedIssue as Issue}
                    />
                )}
            </View>
        </HomeAnalysisProvider>
    )
}