import { ScreenProps } from "./types";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import {
    CameraType,
    CameraView,
    useCameraPermissions,
    useMicrophonePermissions,
} from "expo-camera";
import { RefreshCw, LibraryBig } from "lucide-react-native";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';

function RecordingTimer({ isRecording, insets }: { isRecording: boolean, insets: any }) {
    const [recordingTime, setRecordingTime] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } else {
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    if (!isRecording) return null;

    const formattedTime = new Date(recordingTime * 1000).toISOString().substring(14, 19);

    return (
        <View
            className="absolute top-0 w-full items-center z-10 pointer-events-none"
            style={{ paddingTop: insets.top > 0 ? insets.top + 16 : 40 }}
        >
            <View className="flex-row items-center rounded-full bg-red-600/90 px-4 py-1.5">
                <View className="mr-2 h-2.5 w-2.5 rounded-full bg-white" />
                <Text className="font-mono text-base font-bold text-white tracking-widest">
                    {formattedTime}
                </Text>
            </View>
        </View>
    );
}

export default function SelectVideoScreen({ onBack, onNext }: ScreenProps) {
    const cameraRef = useRef<CameraView | null>(null);
    const insets = useSafeAreaInsets();

    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
    const [hasMediaLibraryPermission, requestMediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();

    const [facing, setFacing] = useState<CameraType>("back");
    const [isRecording, setIsRecording] = useState(false);
    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [isBusy, setIsBusy] = useState(false);

    useEffect(() => {
        if (videoUri) {
            onNext();
        }
    }, [videoUri]);

    useEffect(() => {
        if (!cameraPermission?.granted) {
            requestCameraPermission();
        }
        if (!microphonePermission?.granted) {
            requestMicrophonePermission();
        }
    }, []);

    const hasPermissions = cameraPermission?.granted && microphonePermission?.granted && hasMediaLibraryPermission;

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setVideoUri(result.assets[0].uri);
        } else {
            alert('You did not select any video.');
        }
    };

    const startRecording = async () => {
        if (!cameraRef.current || isRecording || isBusy) return;

        // First update the UI exactly as before
        setIsBusy(true);
        setVideoUri(null);
        setIsRecording(true);

        // Wait 100ms for React/Yoga layout passes to finish rendering the new Timer UI
        setTimeout(async () => {
            if (!cameraRef.current) return;
            
            try {
                const video = await cameraRef.current.recordAsync({
                    maxDuration: 30,
                });

                if (video?.uri) {
                    setVideoUri(video.uri);
                }
            } catch (error) {
                console.error("recordAsync error:", error);
                Alert.alert("Recording failed", "Could not record the video.");
            } finally {
                // Because recordAsync blocks until stopRecording() is called,
                // we clean up the state in this finally block.
                setIsRecording(false);
                setIsBusy(false);
            }
        }, 100);
    };

    const stopRecording = async () => {
        if (!cameraRef.current || !isRecording) return;

        try {
            cameraRef.current.stopRecording();
        } catch (error) {
            console.error("stopRecording error:", error);
        }
    };

    const flipCamera = () => {
        if (isRecording) return;
        setFacing((current) => (current === "back" ? "front" : "back"));
    };

    if (!cameraPermission || !microphonePermission) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator />
            </View>
        );
    }

    if (!hasPermissions) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-zinc-950 px-6">
                <Text className="mb-3 text-2xl font-bold text-white">Permissions needed</Text>
                <Text className="mb-5 text-center text-base text-zinc-300">
                    Camera and microphone access are required to record video.
                </Text>

                <Pressable
                    className="rounded-xl bg-white px-5 py-3"
                    onPress={async () => {
                        await requestCameraPermission();
                        await requestMicrophonePermission();
                    }}
                >
                    <Text className="font-bold text-zinc-950">Grant permissions</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-black">
            {/* Camera stretches everywhere - underneath notch and tab bars */}
            <CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                facing={facing}
                mode="video"
                mute={false}
            />

            {/* We force the controls to stick to the bottom, but pad them so they sit above the home bar */}
            <View
                className="absolute bottom-0 left-0 right-0 w-full"
                style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 24 }}
            >
                <View className="flex-row items-center justify-center px-6 pt-2 pb-5 min-h-[100px]">
                    
                    {/* Absolutely position the left button */}
                    {!isRecording && (
                        <View className="absolute left-6">
                            <Pressable
                                onPress={flipCamera}
                                disabled={isRecording}
                                className="min-w-[72px] items-center rounded-2xl bg-black/40 px-4 py-3 active:bg-white/60 active:border active:border-white/60"
                            >
                                <RefreshCw size={20} color="white" />
                                <Text className="text-xs text-white">Flip</Text>
                            </Pressable>
                        </View>
                    )}

                    {/* Center record button stays exactly in the middle */}
                    <Pressable
                        onPress={isRecording ? stopRecording : startRecording}
                        disabled={isBusy && !isRecording}
                        className={`h-[84px] w-[84px] items-center justify-center rounded-full shadow-md border-[6px] ${
                            isRecording ? "border-red-500" : "border-white"
                        }`}
                    >
                        <View
                            className={`bg-red-500 ${
                                isRecording ? "h-[30px] w-[30px] rounded-lg" : "h-[56px] w-[56px] rounded-full"
                            }`}
                        />
                    </Pressable>
                    
                    {/* Absolutely position the right button */}
                    {!isRecording && (
                        <View className="absolute right-6">
                            <Pressable
                                onPress={() => {
                                    pickImageAsync();
                                }}
                                className="min-w-[72px] items-center rounded-2xl bg-black/40 px-4 py-3 active:bg-white/60 active:border active:border-white/60"
                            >
                                <LibraryBig size={20} color="white" />
                                <Text className="text-xs text-white">Gallery</Text>
                            </Pressable>
                        </View>
                    )}
                </View>

                {/* Helper text dropped slightly under controls with shadow for visibility */}
                <Text
                    className="px-6 text-center text-sm font-medium text-white"
                    style={{ textShadowColor: "rgba(0, 0, 0, 0.8)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}
                >
                    {isRecording
                        ? "Recording… tap the red button to stop"
                        : "Tap the red button to start recording"}
                </Text>
            </View>

            {/* Isolated Timer UI overlay */}
            <RecordingTimer isRecording={isRecording} insets={insets} />
        </View>
    );
}