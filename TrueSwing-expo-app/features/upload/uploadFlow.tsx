import { useScreenSequence } from "./hooks/useScreenState";
import { View, Text, Button, TouchableOpacity } from "react-native";
import SelectVideoScreen from "./screens/SelectVideoScreen";
import TrimVideoScreen from "./screens/TrimVideoScreen";
import PromptsScreen from "./screens/PromptsScreen";
import UploadProgressScreen from "./screens/UploadProgressScreen";
import { useVideo } from "./hooks/useVideo";
import { usePrompt } from "./hooks/usePrompt";


interface ScreenMap {
  SelectVideo: undefined;
  TrimVideo: undefined; 
  Prompts: undefined;
  UploadProgress: undefined;
}

type ScreenName = keyof ScreenMap;

const allScreens = ['SelectVideo', 'TrimVideo', 'Prompts', 'UploadProgress'];

export default function UploadFlow() {
    const { currentScreen, next, prev, goTo } = useScreenSequence({ screens: allScreens });
    const { videoUri, setVideoUri, removeVideo, trimmedVideoUri, setTrimmedVideoUri, trimVideo } = useVideo();
    const promptActions = usePrompt();

    return (
        <View style={{ flex: 1 }}>
            {currentScreen === 'SelectVideo' && <SelectVideoScreen onNext={next} onBack={() => {}} setVideoUri={setVideoUri} videoUri={videoUri} isActive={currentScreen === 'SelectVideo'} />}
            {currentScreen === 'TrimVideo' && <TrimVideoScreen onNext={next} onBack={prev} videoUri={videoUri}  removeVideo={removeVideo} setVideoUri={setVideoUri} trimVideo={trimVideo} />}
            {currentScreen === 'Prompts' && <PromptsScreen onNext={next} onBack={prev} prompt={promptActions} />}
            {currentScreen === 'UploadProgress' && <UploadProgressScreen onBack={prev} onNext={() => {}} />}
        </View>
    );
}