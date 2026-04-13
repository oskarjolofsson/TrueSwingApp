import { ScreenProps } from "./types";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  CameraType,
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";

export default function SelectVideoScreen({onBack, onNext}: ScreenProps) {
  const cameraRef = useRef<CameraView | null>(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();

  const [facing, setFacing] = useState<CameraType>("back");
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    if (!cameraPermission?.granted) {
      requestCameraPermission();
    }
    if (!microphonePermission?.granted) {
      requestMicrophonePermission();
    }
  }, []);

  const hasPermissions = cameraPermission?.granted && microphonePermission?.granted;

  const startRecording = async () => {
    if (!cameraRef.current || isRecording || isBusy) return;

    try {
      setIsBusy(true);
      setVideoUri(null);
      setIsRecording(true);

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
      setIsRecording(false);
      setIsBusy(false);
    }
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
    <SafeAreaView className="flex-1 bg-black">
      <View className="m-4 flex-1 overflow-hidden rounded-3xl bg-zinc-950">
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing={facing}
          mode="video"
          mute={false}
        />
      </View>

      <View className="flex-row items-center justify-between px-6 pt-2 pb-5">
        <Pressable
          onPress={flipCamera}
          disabled={isRecording}
          className={`min-w-[72px] items-center rounded-2xl px-4 py-3 ${
            isRecording ? "bg-white/10 opacity-50" : "bg-white/10 active:bg-white/20"
          }`}
        >
          <Text className="font-semibold text-white">Flip</Text>
        </Pressable>

        <Pressable
          onPress={isRecording ? stopRecording : startRecording}
          disabled={isBusy}
          className={`h-[84px] w-[84px] items-center justify-center rounded-full border-[6px] ${
            isRecording ? "border-red-500" : "border-white"
          }`}
        >
          <View
            className={`bg-red-500 ${
              isRecording ? "h-[30px] w-[30px] rounded-lg" : "h-[56px] w-[56px] rounded-full"
            }`}
          />
        </Pressable>

        <Pressable
          onPress={() => {
            if (videoUri) {
              Alert.alert("Recorded", videoUri);
            } else {
              Alert.alert("No video yet", "Record a clip first.");
            }
          }}
          className="min-w-[72px] items-center rounded-2xl bg-white/10 px-4 py-3 active:bg-white/20"
        >
          <Text className="font-semibold text-white">Use</Text>
        </Pressable>
      </View>

      <Text className="px-6 pb-6 text-center text-sm text-zinc-300">
        {isRecording
          ? "Recording… tap the red button to stop"
          : "Tap the red button to start recording"}
      </Text>
    </SafeAreaView>
  );
}