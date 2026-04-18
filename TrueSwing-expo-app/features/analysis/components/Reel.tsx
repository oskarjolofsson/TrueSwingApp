import { useState, useEffect } from "react";
import { Text, View, StatusBar, Dimensions, Pressable, Image } from "react-native";
import { useVideoPlayer, VideoView, VideoSource } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import TextBox from "features/shared/components/TextBox";
import { Pause, RotateCcw } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

type ReelProps = {
    video_url: string | null
    thumbnail_url?: string | null
    shouldPlay?: boolean
}

export default function Reel({
    video_url,
    thumbnail_url,
    shouldPlay = true,
}: ReelProps) {

    const source: VideoSource | null = video_url ? video_url : null;
    const [isPlaying, setIsPlaying] = useState(shouldPlay);

    const player = useVideoPlayer(source, (playerInstance) => {
        playerInstance.loop = false;
        playerInstance.muted = true;
        playerInstance.volume = 0; // Add this line
        if (shouldPlay) {
            playerInstance.play();
        }
    });

    useEffect(() => {
        if (!player) return;
        if (shouldPlay) {
            player.replay();
        } else {
            player.pause();
        }
    }, [shouldPlay, player]);

    useEffect(() => {
        if (!player) return;

        // Set initial state
        setIsPlaying(player.playing);

        // Create a listener for when the playing state changes
        const subscription = player.addListener('playingChange', (event) => {
            setIsPlaying(event.isPlaying);
        });

        // Cleanup listener when component unmounts
        return () => {
            subscription.remove();
        };
    }, [player]);

    if (!source) {
        return (
            <TextBox header="No video available" text="An error occured while loading the video" />
        )
    }

    return (
        <View style={{ width, height }} className="bg-black">
            <StatusBar barStyle="light-content" />

            <View className="absolute inset-0">
                {thumbnail_url ? (
                    <>
                        <Image
                            source={{ uri: thumbnail_url }}
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                            }}
                            blurRadius={28}
                            resizeMode="cover"
                        />
                        <View
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.15)",
                            }}
                        />
                    </>
                ) : null}

                {video_url ? (
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
                        if (player.playing) {
                            player.pause();
                        } else {
                            // Check if the video has ended. If it has, replay from the start. Otherwise, just play.
                            if (player.currentTime >= player.duration) {
                                player.replay();
                            } else {
                                player.play();
                            }
                        }
                    }}
                />
            </View>

            {!isPlaying && (
                <View className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <View className="bg-black/30 rounded-full p-4 mb-40">
                        {player.currentTime >= player.duration ? (
                            <RotateCcw
                                size={30}
                                color="rgba(255, 255, 255, 0.6)" // 60% opacity for the outline
                                fill="transparent"               // Remove the solid white fill
                                strokeWidth={1.5}                // A thin outline
                            />
                        ) : (
                            <Pause
                                size={30}
                                color="rgba(255, 255, 255, 0.6)" // 60% opacity for the outline
                                fill="transparent"               // Remove the solid white fill
                                strokeWidth={1.5}                // A thin outline
                            />
                        )}
                    </View>
                </View>
            )}
        </View>
    )
}