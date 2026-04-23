import { useScreenSequence } from "../shared/hooks/useScreenState";
import { View, Text, Button, TouchableOpacity } from "react-native";
import SelectVideoScreen from "./screens/SelectVideoScreen";
import TrimVideoScreen from "./screens/TrimVideoScreen";
import PromptsScreen from "./screens/PromptsScreen";
import UploadProgressScreen from "./screens/UploadProgressScreen";
import { useVideo } from "./hooks/useVideo";
import { usePrompt } from "./hooks/usePrompt";
import { useUpload } from "./hooks/useUpload";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef } from "react";

interface ScreenMap {
  SelectVideo: undefined;
  TrimVideo: undefined; 
  Prompts: undefined;
  UploadProgress: undefined;
}

const allScreens = ['SelectVideo', 'TrimVideo', 'Prompts', 'UploadProgress'];

export default function UploadFlow() {
    const { currentScreen, next, prev, goTo } = useScreenSequence({ screens: allScreens });
    const { videoUri, setVideoUri, removeVideo, trimmedVideoUri, trimVideo, endTime, startTime } = useVideo();
    const promptActions = usePrompt();
    const upload = useUpload();

    const didInitRef = useRef(false);

    const resetFlow = useCallback(() => {
        removeVideo();
        promptActions.setStartTime(0);
        promptActions.setEndTime(0);
        goTo("SelectVideo");
    }, [removeVideo, promptActions, goTo]);

    // Run once when entering this flow for the first time, not on every refocus.
    useFocusEffect(
        useCallback(() => {
            if (!didInitRef.current) {
                didInitRef.current = true;
                resetFlow();
            }
        }, [resetFlow])
    )


    const handleStartUpload = () => {
        // set start and end-time to correct values before starting upload
        promptActions.setStartTime(startTime);
        promptActions.setEndTime(endTime);

        if (trimmedVideoUri && promptActions.prompt) {
            upload.startUpload(trimmedVideoUri, promptActions.prompt, startTime, endTime);
            next();
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {currentScreen === 'SelectVideo' && <SelectVideoScreen onNext={next} onBack={() => {}} setVideoUri={setVideoUri} videoUri={videoUri} isActive={currentScreen === 'SelectVideo'} />}
            {currentScreen === 'TrimVideo' && <TrimVideoScreen onNext={next} onBack={prev} videoUri={videoUri}  removeVideo={removeVideo} setVideoUri={setVideoUri} trimVideo={trimVideo} />}
            {currentScreen === 'Prompts' && <PromptsScreen onNext={handleStartUpload} onBack={prev} prompt={promptActions} />}
            {currentScreen === 'UploadProgress' && <UploadProgressScreen onBack={() => {resetFlow(); goTo("SelectVideo")}} onNext={() => {}} upload={upload} />}
        </View>
    );
}