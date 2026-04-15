import { useState } from "react";
import { MediaToolkit } from 'react-native-media-toolkit';

type UseVideoReturn = {
    videoUri: string | null;
    removeVideo: () => void;
    setVideoUri: (uri: string | null) => void;
    trimmedVideoUri: string | null;
    setTrimmedVideoUri: (uri: string | null) => void;
    trimVideo: (startMs: number, endMs: number) => Promise<void>;
    endTime: number;
    setEndTime: (time: number) => void;
}

export function useVideo(): UseVideoReturn {

    const [videoUriState, setVideoUriState] = useState<string | null>(null);
    const [trimmedVideoUriState, setTrimmedVideoUriState] = useState<string | null>(null);
    const [endTime, setEndTime] = useState<number>(0);

    const videoUri = videoUriState;
    const trimmedVideoUri = trimmedVideoUriState || videoUriState;

    const setVideoUri = (uri: string | null) => {
        setVideoUriState(uri);
        setTrimmedVideoUriState(null); // Resets trimmed URI when original video changes
        setEndTime(0);
    }

    // Remove video
    const removeVideo = () => {
        setVideoUriState(null);
        setTrimmedVideoUriState(null);
        setEndTime(0);
    }

    const setTrimmedVideoUri = (uri: string | null) => {
        setTrimmedVideoUriState(uri);
    }

    const trimVideo = async (startMs: number, endMs: number) => {
        if (!videoUriState) return;

        const result = await MediaToolkit.trimVideo(videoUriState, {
            startTime: startMs,  // start in milliseconds
            endTime: endMs,    // end in milliseconds
        });
        setTrimmedVideoUriState(result.uri);
        
        // Update endTime from the returned result metadata (duration is in ms)
        if (result.duration !== undefined) {
            setEndTime(result.duration / 1000);
        }
    }

    return {
        videoUri,
        removeVideo,
        setVideoUri,
        trimmedVideoUri,
        setTrimmedVideoUri,
        trimVideo,
        endTime,
        setEndTime
    };
}

