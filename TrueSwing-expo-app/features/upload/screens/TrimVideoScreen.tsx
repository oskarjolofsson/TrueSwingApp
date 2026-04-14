import { useEffect, useRef } from "react";
import {
  View,
  Alert,
  NativeEventEmitter,
  NativeModules,
  Pressable,
  Text,
} from "react-native";
import { showEditor, closeEditor, isValidFile } from "react-native-video-trim";
import { ScreenProps } from "./types";

type TrimScreenProps = ScreenProps & {
  videoUri: string | null;
  setVideoUri: (uri: string | null) => void;
  removeVideo: () => void;
};

export default function TrimScreen({
  onBack,
  onNext,
  videoUri,
  setVideoUri,
}: TrimScreenProps) {
  const hasOpenedRef = useRef(false);
  const hasNavigatedRef = useRef(false);

  const openEditor = async () => {
    if (!videoUri) {
      onBack?.();
      return;
    }

    if (hasOpenedRef.current) return;
    hasOpenedRef.current = true;

    const valid = await isValidFile(videoUri);
    if (!valid) {
      Alert.alert("Invalid file", "This video could not be opened.");
      onBack?.();
      return;
    }

    showEditor(videoUri, {
      maxDuration: 30_000,
      minDuration: 1_000,
      saveButtonText: "Use clip",
      cancelButtonText: "Cancel",
      headerText: "Trim your swing",
      alertOnFailToLoad: true,
    });
  };

  useEffect(() => {
    const videoTrimModule = NativeModules.VideoTrim;

    if (!videoTrimModule) {
      Alert.alert("Trimmer unavailable", "The native video trimmer is not available.");
      onBack?.();
      return;
    }

    const eventEmitter = new NativeEventEmitter(videoTrimModule);

    const subscription = eventEmitter.addListener("VideoTrim", (event) => {
      if (hasNavigatedRef.current) return;

      switch (event.name) {
        case "onFinishTrimming":
          if (event.outputPath) {
            setVideoUri(event.outputPath);
            hasNavigatedRef.current = true;
            onNext?.();
          } else {
            hasNavigatedRef.current = true;
            onBack?.();
          }
          break;

        case "onCancel":
          hasNavigatedRef.current = true;
          onBack?.();
          break;

        case "onError":
          console.error("Trim error:", event.message);
          Alert.alert("Trim failed", event.message ?? "Could not trim the video.");
          hasNavigatedRef.current = true;
          onBack?.();
          break;
      }
    });

    openEditor();

    return () => {
      subscription.remove();
      try {
        closeEditor();
      } catch {}
    };
  }, [videoUri, onBack, onNext, setVideoUri]);

  return (
    <View className="flex-1 items-center justify-center bg-slate-950 px-6">
      <Text className="mb-3 text-2xl font-bold text-white">Trim Video</Text>
      <Text className="mb-8 text-center text-slate-300">
        Waiting for the trimmer…
      </Text>

      <Pressable
        onPress={() => {
          hasOpenedRef.current = false;
          openEditor();
        }}
        className="rounded-2xl bg-blue-600 px-5 py-4"
      >
        <Text className="text-center font-semibold text-white">
          Open Trimmer Again
        </Text>
      </Pressable>
    </View>
  );
}