import { useState } from "react";

type UseVideoReturn = {
    videoUri: string | null;
    removeVideo: () => void;
    setVideoUri: (uri: string | null) => void; 
    trimmedVideoUri: string | null;
    setTrimmedVideoUri: (uri: string | null) => void;
}

export function useVideo() {

    const [videoUri, setVideoUri] = useState<string | null>(null);
    const [trimmedVideoUri, setTrimmedVideoUri] = useState<string | null>(null);

    // Remove video
    const removeVideo = () => {
        setVideoUri(null);
        setTrimmedVideoUri(null);
    }

    return {
        videoUri,
        removeVideo,
        setVideoUri,
        trimmedVideoUri,
        setTrimmedVideoUri
    }
}

