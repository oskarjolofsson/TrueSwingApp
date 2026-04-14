import { useScreenSequence } from "./hooks/useScreenState";
import { View, Text, Button, TouchableOpacity } from "react-native";
import SelectVideoScreen from "./screens/SelectVideoScreen";
import TrimVideoScreen from "./screens/TrimVideoScreen";
import PromptsScreen from "./screens/PromptsScreen";
import UploadProgressScreen from "./screens/UploadProgressScreen";
import { useVideo } from "./hooks/useVideo";
import { useState, useMemo } from "react";


interface ScreenMap {
  SelectVideo: undefined;
  TrimVideo: undefined; 
  Prompts: undefined;
  UploadProgress: undefined;
}

type ScreenName = keyof ScreenMap;

export default function UploadFlow() {
    const allScreens: ScreenName[] = ['SelectVideo', 'TrimVideo', 'Prompts', 'UploadProgress'];
    const { currentScreen, next, prev, goTo } = useScreenSequence({ screens: allScreens });
    const { videoUri, setVideoUri, removeVideo, trimmedVideoUri, setTrimmedVideoUri } = useVideo();

    return (
        <View style={{ flex: 1 }}>
            {currentScreen === 'SelectVideo' && <SelectVideoScreen onNext={next} onBack={() => {}} setVideoUri={setVideoUri} videoUri={videoUri}/>}
            {currentScreen === 'TrimVideo' && <TrimVideoScreen onNext={next} onBack={prev} videoUri={videoUri} setTrimmedVideoUri={setTrimmedVideoUri} removeVideo={removeVideo} trimmedUri={trimmedVideoUri} />}
            {currentScreen === 'Prompts' && <PromptsScreen onNext={next} onBack={prev} />}
            {currentScreen === 'UploadProgress' && <UploadProgressScreen onBack={prev} onNext={() => {}} />}
        </View>
    );
}