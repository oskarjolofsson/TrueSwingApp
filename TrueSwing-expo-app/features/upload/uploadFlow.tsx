import { useScreenSequence } from "../shared/hooks/useScreenState";
import { View, Text, Button, TouchableOpacity } from "react-native";
import SelectVideoScreen from "./screens/SelectVideoScreen";
import TrimVideoScreen from "./screens/TrimVideoScreen";
import PromptsScreen from "./screens/PromptsScreen";
import UploadProgressScreen from "./screens/UploadProgressScreen";
import { useVideo } from "./hooks/useVideo";
import { usePrompt } from "./hooks/usePrompt";
import { useUpload } from "./hooks/useUpload";
import { useFocusEffect } from '@react-navigation/native';
import React  from "react";


interface ScreenMap {
  SelectVideo: undefined;
  TrimVideo: undefined; 
  Prompts: undefined;
  UploadProgress: undefined;
}

const allScreens = ['SelectVideo', 'TrimVideo', 'Prompts', 'UploadProgress'];

export default function UploadFlow() {
    const { currentScreen, next, prev, goTo } = useScreenSequence({ screens: allScreens });
    const { videoUri, setVideoUri, removeVideo, trimmedVideoUri, setTrimmedVideoUri, trimVideo, endTime } = useVideo();
    const promptActions = usePrompt();
    const upload = useUpload();

    // Reset the flow
    useFocusEffect(
        React.useCallback(() => {
            console.log("Resetting upload flow state");
            removeVideo();
            promptActions.setEndTime(0);
            goTo('SelectVideo');
        }, [])
    )


    const handleStartUpload = () => {
        // set start and end-time to correct values before starting upload
        promptActions.setStartTime(0);
        promptActions.setEndTime(endTime);

        if (trimmedVideoUri && promptActions.prompt) {
            upload.startUpload(trimmedVideoUri, promptActions.prompt, 0, endTime);
            next();
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {currentScreen === 'SelectVideo' && <SelectVideoScreen onNext={next} onBack={() => {}} setVideoUri={setVideoUri} videoUri={videoUri} isActive={currentScreen === 'SelectVideo'} />}
            {currentScreen === 'TrimVideo' && <TrimVideoScreen onNext={next} onBack={prev} videoUri={videoUri}  removeVideo={removeVideo} setVideoUri={setVideoUri} trimVideo={trimVideo} />}
            {currentScreen === 'Prompts' && <PromptsScreen onNext={handleStartUpload} onBack={prev} prompt={promptActions} />}
            {currentScreen === 'UploadProgress' && <UploadProgressScreen onBack={prev} onNext={() => {}} upload={upload} />}
        </View>
    );
}