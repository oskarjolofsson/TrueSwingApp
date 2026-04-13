import { useScreenSequence } from "./hooks/useScreenState";
import { View, Text, Button, TouchableOpacity } from "react-native";
import SelectVideoScreen from "./screens/SelectVideoScreen";
import TrimVideoScreen from "./screens/TrimVideoScreen";
import PromptsScreen from "./screens/PromptsScreen";
import UploadProgressScreen from "./screens/UploadProgressScreen";


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

    // Record to map all screen names to their respective components
    const screens: Record<ScreenName, React.ReactElement> = {
        SelectVideo: <SelectVideoScreen onNext={next} onBack={() => {}} />,
        TrimVideo: <TrimVideoScreen onNext={next} onBack={prev} />,
        Prompts: <PromptsScreen onNext={next} onBack={prev} />,
        UploadProgress: <UploadProgressScreen onBack={prev} onNext={() => {}} />
    };

    return (
        <View style={{ flex: 1 }}>
            {screens[currentScreen]}
        </View>
    );
}