import { useScreenSequence } from "../shared/hooks/useScreenState";
import { Alert, View } from "react-native";
import SelectVideoScreen from "./screens/SelectVideoScreen";
import TrimVideoScreen from "./screens/TrimVideoScreen";
import PromptsScreen from "./screens/PromptsScreen";
import UploadProgressScreen from "./screens/UploadProgressScreen";
import { useVideo } from "./hooks/useVideo";
import { usePrompt } from "./hooks/usePrompt";
import { useUpload } from "./hooks/useUpload";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import { AiConsentModal } from "features/privacy/components/AIconsentModel";
import { hasValidAiConsent, saveAiConsent } from "features/privacy/utils/consentHelper";

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
    const [isConsentModalVisible, setIsConsentModalVisible] = useState(false);
    const [pendingUploadRequest, setPendingUploadRequest] = useState<{
        videoUri: string;
        startTime: number;
        endTime: number;
    } | null>(null);

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


    const startAnalysis = useCallback(
        async (request: { videoUri: string; startTime: number; endTime: number }) => {
            promptActions.setStartTime(request.startTime);
            promptActions.setEndTime(request.endTime);

            if (!promptActions.prompt) {
                return;
            }

            await upload.startUpload(request.videoUri, promptActions.prompt, request.startTime, request.endTime);
            next();
        },
        [next, promptActions, upload]
    );

    const handleStartUpload = useCallback(async () => {
        if (!trimmedVideoUri) {
            return;
        }

        const request = {
            videoUri: trimmedVideoUri,
            startTime,
            endTime,
        };

        const consentGranted = await hasValidAiConsent();
        if (consentGranted) {
            await startAnalysis(request);
            return;
        }

        setPendingUploadRequest(request);
        setIsConsentModalVisible(true);
    }, [endTime, startAnalysis, startTime, trimmedVideoUri]);

    const handleAcceptConsent = useCallback(async () => {
        try {
            await saveAiConsent();

            const request = pendingUploadRequest;
            setPendingUploadRequest(null);
            setIsConsentModalVisible(false);

            if (request) {
                await startAnalysis(request);
            }
        } catch (error) {
            Alert.alert(
                "Consent unavailable",
                error instanceof Error ? error.message : "Could not save AI consent. Please try again."
            );
        }
    }, [pendingUploadRequest, startAnalysis]);

    const handleCancelConsent = useCallback(() => {
        setPendingUploadRequest(null);
        setIsConsentModalVisible(false);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {currentScreen === 'SelectVideo' && <SelectVideoScreen onNext={next} onBack={() => {}} setVideoUri={setVideoUri} videoUri={videoUri} isActive={currentScreen === 'SelectVideo'} />}
            {currentScreen === 'TrimVideo' && <TrimVideoScreen onNext={next} onBack={prev} videoUri={videoUri}  removeVideo={removeVideo} setVideoUri={setVideoUri} trimVideo={trimVideo} />}
            {currentScreen === 'Prompts' && <PromptsScreen onNext={() => void handleStartUpload()} onBack={prev} prompt={promptActions} />}
            {currentScreen === 'UploadProgress' && <UploadProgressScreen onBack={() => {resetFlow(); goTo("SelectVideo")}} onNext={() => {}} upload={upload} />}
            <AiConsentModal
                visible={isConsentModalVisible}
                onAccept={handleAcceptConsent}
                onCancel={handleCancelConsent}
            />
        </View>
    );
}