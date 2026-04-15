import React, { useEffect, useRef, useCallback, useState, use } from "react";
import { View, Alert, Pressable, Text, Dimensions, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Pause, RotateCcw } from "lucide-react-native";
import VideoTrimBar from "../components/videoTrimBar";
import { useVideoPlayer, VideoView, VideoSource } from "expo-video";

import { ScreenProps } from "../types";

const { width, height } = Dimensions.get("window");

type TrimScreenProps = ScreenProps & {
  videoUri: string | null;
  setVideoUri: (uri: string | null) => void;
  removeVideo: () => void;
  trimVideo: (startMs: number, endMs: number) => Promise<void>;
};

export default function TrimScreen({
  onBack,
  onNext,
  videoUri,
  setVideoUri,
  trimVideo
}: TrimScreenProps) {

  // Video preview
  const source: VideoSource | null = videoUri ? videoUri : null;
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  const player = useVideoPlayer(source, (playerInstance) => {
    playerInstance.loop = false;
    playerInstance.muted = true;
    playerInstance.volume = 0;
    playerInstance.pause();
  });

  useEffect(() => {
    if (!player) return;

    setIsPlaying(player.playing);
    
    // Set duration if it's already available
    if (player.duration) {
      setDuration(player.duration);
    }

    const playingSubscription = player.addListener('playingChange', (event) => {
      setIsPlaying(event.isPlaying);
    });

    // Listen for status changes (like when the video metadata loads)
    const statusSubscription = player.addListener('statusChange', (event) => {
      if (event.status === 'readyToPlay' && player.duration) {
        setDuration(Math.floor(player.duration * 1000));
      }
    });

    return () => {
      playingSubscription.remove();
      statusSubscription.remove();
    };
  }, [player]);

  const handleSeek = useCallback((ms: number) => {
    if (player) {
      player.currentTime = ms / 1000;
      player.pause();
    }
  }, [player]);

  const handleRangeChange = useCallback((start: number, end: number) => {
    setTrimStart(start);
    setTrimEnd(end);
  }, []);

  return (
    <View style={{ width, height }} className="bg-black">
      <StatusBar barStyle="light-content" />

      <View className="absolute inset-0 pb-32">
        {videoUri ? (
          <VideoView
            player={player}
            style={{ width: "100%", height: "100%" }}
            contentFit="contain"
            nativeControls={false}
            fullscreenOptions={{ enable: false }}
          />
        ) : (
          <View className="flex-1 items-center justify-center bg-[#0B0D12]">
            <Text className="text-zinc-500">No video available</Text>
          </View>
        )}

        <LinearGradient
          colors={[
            "rgba(0,0,0,0.55)",
            "rgba(0,0,0,0.10)",
            "rgba(0,0,0,0.58)",
          ]}
          locations={[0, 0.42, 1]}
          style={{ position: "absolute", inset: 0 }}
        />

        <Pressable
          className="absolute inset-0 z-10"
          onPress={() => {
            if (player?.playing) {
              player.pause();
            } else if (player) {
              if (player.currentTime >= player.duration) {
                player.replay();
              } else {
                player.play();
              }
            }
          }}
        />

        {!isPlaying && player && (
          <View className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <View className="bg-black/30 rounded-full p-4">
              {player.currentTime >= player.duration ? (
                <RotateCcw
                  size={30}
                  color="rgba(255, 255, 255, 0.6)"
                  fill="transparent"
                  strokeWidth={1.5}
                />
              ) : (
                <Pause
                  size={30}
                  color="rgba(255, 255, 255, 0.6)"
                  fill="transparent"
                  strokeWidth={1.5}
                />
              )}
            </View>
          </View>
        )}
      </View>

      <SafeAreaView className="absolute bottom-0 w-full z-30" pointerEvents="box-none">
        <View className="px-5 pb-8 pt-3 bg-black/80">
          <View className="flex-row justify-between mb-4">
            <Pressable onPress={() => {setVideoUri(null); onBack();}}>
              <Text className="text-white font-medium text-lg">Back</Text>
            </Pressable>
            <Pressable onPress={() => {trimVideo(trimStart, trimEnd);onNext()}}>
              <Text className="text-white font-bold text-lg">Next</Text>
            </Pressable>
          </View>
          
          {duration > 0 && (
            <VideoTrimBar
              videoUri={videoUri!}
              durationMs={duration} 
              onSeek={handleSeek}
              onRangeChange={handleRangeChange}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
