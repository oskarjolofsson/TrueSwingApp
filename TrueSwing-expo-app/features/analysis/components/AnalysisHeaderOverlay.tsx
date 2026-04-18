import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { Trash2 } from "lucide-react-native";

type AnalysisHeaderOverlayProps = {
  dateLabel?: string;
  onDeletePress: () => void;
  deleting?: boolean;
};

export default function AnalysisHeaderOverlay({
  dateLabel = "",
  onDeletePress,
  deleting = false,
}: AnalysisHeaderOverlayProps) {
  const [displayedDate, setDisplayedDate] = useState(dateLabel);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (dateLabel === displayedDate) return;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(translateAnim, {
        toValue: -6,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDisplayedDate(dateLabel);

      translateAnim.setValue(6);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [dateLabel, displayedDate, fadeAnim, translateAnim]);

  return (
    <View className="absolute top-0 left-0 right-0 z-50 px-4 pt-16">
      <View
        className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 10,
        }}
      >
        <View className="flex-row items-center px-4 py-3">
          <View className="w-14 items-start">
            <Pressable
              onPress={onDeletePress}
              disabled={deleting}
              className="h-11 w-11 items-center justify-center rounded-2xl border border-red-400/20 bg-white/5 active:bg-white/10"
              style={{ opacity: deleting ? 0.5 : 1 }}
            >
              <Trash2 size={19} color="#f87171" />
            </Pressable>
          </View>

          <View className="flex-1 items-center justify-center">
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: translateAnim }],
              }}
            >
              <Text className="text-xl font-semibold tracking-tight text-white">
                {displayedDate}
              </Text>
            </Animated.View>
          </View>

          <View className="w-14 items-end">
            {deleting ? (
              <Text className="text-xs font-medium text-white/50">...</Text>
            ) : null}
          </View>
        </View>

        <View className="h-px bg-white/5" />
      </View>
    </View>
  );
}