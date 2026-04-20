import { useCallback, useEffect, useMemo, useState } from "react";
import { useVideoPlayer, type VideoSource } from "expo-video";

type UseReelPlaybackParams = {
    source: VideoSource | null;
    shouldPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
};

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "00:00";
    }

    const totalSeconds = Math.floor(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function useReelPlayback({
    source,
    shouldPlay = true,
    loop = false,
    muted = true,
}: UseReelPlaybackParams) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isScrubbing, setIsScrubbing] = useState(false);
    const [scrubTime, setScrubTime] = useState(0);

    const player = useVideoPlayer(source, (playerInstance) => {
        playerInstance.loop = loop;
        playerInstance.muted = muted;
        playerInstance.volume = muted ? 0 : 1;

        if (shouldPlay) {
            playerInstance.play();
        } else {
            playerInstance.pause();
        }
    });

    useEffect(() => {
        if (!player) return;

        player.loop = loop;
        player.muted = muted;
        player.volume = muted ? 0 : 1;
    }, [loop, muted, player]);

    useEffect(() => {
        if (!player) return;

        if (shouldPlay) {
            if (player.currentTime >= player.duration && player.duration > 0) {
                player.replay();
            } else {
                player.play();
            }
        } else {
            player.pause();
        }
    }, [shouldPlay, player]);

    useEffect(() => {
        if (!player) return;

        setIsPlaying(player.playing);
        setDuration(Number.isFinite(player.duration) ? player.duration : 0);
        setCurrentTime(Number.isFinite(player.currentTime) ? player.currentTime : 0);

        const playingSubscription = player.addListener("playingChange", (event) => {
            setIsPlaying(event.isPlaying);
        });

        const statusSubscription = player.addListener("statusChange", (event) => {
            if (event.status === "readyToPlay" && Number.isFinite(player.duration)) {
                setDuration(player.duration);
            }
        });

        const tick = setInterval(() => {
            if (!Number.isFinite(player.currentTime)) return;
            if (!isScrubbing) {
                setCurrentTime(player.currentTime);
            }

            if (Number.isFinite(player.duration)) {
                setDuration(player.duration);
            }
        }, 100);

        return () => {
            playingSubscription.remove();
            statusSubscription.remove();
            clearInterval(tick);
        };
    }, [isScrubbing, player]);

    const seekTo = useCallback(
        (seconds: number) => {
            if (!player) return;
            const target = clamp(seconds, 0, Math.max(duration, 0));
            player.currentTime = target;
            setCurrentTime(target);
        },
        [duration, player]
    );

    const togglePlayPause = useCallback(() => {
        if (!player) return;

        if (player.playing) {
            player.pause();
            return;
        }

        if (player.currentTime >= player.duration && player.duration > 0) {
            player.replay();
        } else {
            player.play();
        }
    }, [player]);

    const beginScrub = useCallback(() => {
        setIsScrubbing(true);
        setScrubTime(currentTime);
    }, [currentTime]);

    const updateScrub = useCallback(
        (seconds: number) => {
            const target = clamp(seconds, 0, Math.max(duration, 0));
            setScrubTime(target);
        },
        [duration]
    );

    const updateScrubByRatio = useCallback(
        (ratio: number) => {
            const boundedRatio = clamp(ratio, 0, 1);
            setScrubTime(boundedRatio * Math.max(duration, 0));
        },
        [duration]
    );

    const endScrub = useCallback(() => {
        seekTo(scrubTime);
        setIsScrubbing(false);
    }, [scrubTime, seekTo]);

    const displayedTime = isScrubbing ? scrubTime : currentTime;

    const progress = useMemo(() => {
        if (duration <= 0) return 0;
        return clamp(displayedTime / duration, 0, 1);
    }, [displayedTime, duration]);

    const durationLabel = useMemo(() => formatTime(duration), [duration]);
    const currentTimeLabel = useMemo(() => formatTime(displayedTime), [displayedTime]);

    return {
        player,
        isPlaying,
        duration,
        currentTime,
        currentTimeLabel,
        durationLabel,
        isScrubbing,
        scrubTime,
        progress,
        togglePlayPause,
        seekTo,
        beginScrub,
        updateScrub,
        updateScrubByRatio,
        endScrub,
    };
}
