import { useState } from "react";
import { MediaToolkit } from 'react-native-media-toolkit';

type UseVideoReturn = {
    videoUri: string | null;
    removeVideo: () => void;
    setVideoUri: (uri: string | null) => void; 
    trimmedVideoUri: string | null;
    setTrimmedVideoUri: (uri: string | null) => void;
    trimVideo: (startMs: number, endMs: number) => Promise<void>;   
}

export function useVideo() {

    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [trimmedVideoUri, setTrimmedVideoUri] = useState<string | null>(null);

    // Remove video
    const removeVideo = () => {
        setVideoUri(null);
        setTrimmedVideoUri(null);
    }

    const trimVideo = async (startMs: number, endMs: number) => {
        if (!videoUri) return;

        const result = await MediaToolkit.trimVideo(videoUri, {
            startTime: startMs,  // start in milliseconds
            endTime: endMs,    // end in milliseconds
        });
        setTrimmedVideoUri(result.uri);
    }

    return {
        videoUri,
        removeVideo,
        setVideoUri,
        trimmedVideoUri,
        setTrimmedVideoUri,
        trimVideo
    }
}

