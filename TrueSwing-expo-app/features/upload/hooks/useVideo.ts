import { useState } from "react";

type UseVideoReturn = {
    videoUri: string | null;
    removeVideo: () => void;
    setVideoUri: (uri: string | null) => void; 
}

export function useVideo() {

    const [videoUri, setVideoUri] = useState<string | null>(null);

    // Remove video
    const removeVideo = () => {
        setVideoUri(null);
    }

    return {
        videoUri,
        removeVideo,
        setVideoUri
    }
}

