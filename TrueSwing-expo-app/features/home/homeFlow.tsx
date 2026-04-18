import { useScreenSequence } from "features/shared/hooks/useScreenState";
import AnalysisResultScreen from "features/analysis/screens/analysisResultScreen";
import PracticeFlow from "features/practice/practiceFlow";

import { useFocusEffect } from '@react-navigation/native';
import { View } from "react-native";
import React from "react";


const allScreens = ['Analysis', 'Practice'];

export default function HomeFlow() {
    const { currentScreen, next, prev, goTo } = useScreenSequence({ screens: allScreens });

    // Reset the flow in case use navigates away from this tab and comes back
    useFocusEffect(
        React.useCallback(() => {
            console.log("Resetting upload flow state");
            goTo('Analysis');
        }, [])
    )
    
    return (
        <View style={{ flex: 1 }}>
            {currentScreen === 'Analysis' && <AnalysisResultScreen /> }
            {currentScreen === 'Practice' && <PracticeFlow analysisIssueId="TestID"/>}
        </View>
    )
}