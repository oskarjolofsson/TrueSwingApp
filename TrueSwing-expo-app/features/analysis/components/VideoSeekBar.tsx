import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { Rewind, FastForward, Play, Pause } from "lucide-react-native";

type VideoSeekBarProps = {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeekStart?: () => void;
  onSeekComplete: (time: number) => void;
  onPlayPause?: () => void;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function VideoSeekBar({
  currentTime,
  duration,
  isPlaying,
  onSeekStart,
  onSeekComplete,
  onPlayPause,
}: VideoSeekBarProps) {
  const safeDuration = Math.max(duration || 0, 0);
  const safeCurrent = Math.min(Math.max(currentTime || 0, 0), safeDuration);

  const [isSliding, setIsSliding] = useState(false);
  const [localValue, setLocalValue] = useState(safeCurrent);

  const displayedValue = isSliding ? localValue : safeCurrent;
  const progress = safeDuration > 0 ? displayedValue / safeDuration : 0;

  const progressPercent: `${number}%` = `${progress * 100}%`;

  return (
    <View className="rounded-3xl border border-white/10 bg-slate-950/75 px-2 py-2 backdrop-blur-md">
      <View className="relative justify-center">
        <View className="absolute h-1.5 w-full rounded-full bg-white/10" />
        <View
          className="absolute h-1.5 rounded-full bg-sky-400"
          style={{ width: progressPercent }}
        />

        <Slider
          value={displayedValue}
          minimumValue={0}
          maximumValue={safeDuration || 1}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor="#ffffff"
          onSlidingStart={() => {
            setIsSliding(true);
            onSeekStart?.();
          }}
          onValueChange={(value) => {
            setLocalValue(value);
          }}
          onSlidingComplete={(value) => {
            setIsSliding(false);
            setLocalValue(value);
            onSeekComplete(value);
          }}
          style={{ height: 28 }}
        />
      </View>
    </View>
  );
}