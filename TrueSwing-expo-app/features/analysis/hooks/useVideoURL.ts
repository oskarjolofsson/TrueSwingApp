import { useState, useEffect } from 'react';
import analysisService from '../services/analysisService';
import type { Analysis } from '../types';

// 1. Create a cache outside the component to survive unmounts
const urlCache: Record<string, { url: string; expiresAt: number }> = {};

// 1 hour in milliseconds
const ONE_HOUR_MS = 60 * 60 * 1000;

export default function useVideoURL(activeAnalysis: Analysis | null): string | null {
    const [videoURL, setVideoURL] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true; // To prevent state updates on unmounted components

        const fetchVideoURL = async () => {
            if (!activeAnalysis) {
                setVideoURL(null);
                return;
            }

            const analysisId = activeAnalysis.analysis_id;
            const now = Date.now();

            // Check the cache first
            const cachedItem = urlCache[analysisId];
            if (cachedItem && cachedItem.expiresAt > now) {
                console.log('Using cached URL for:', analysisId);
                setVideoURL(cachedItem.url);
                return;
            }

            const videoKey = (activeAnalysis as any).video_key || `videos/${activeAnalysis.video_id}`;

            try {
                console.log('Fetching new video URL for analysis:', analysisId);
                const url = await analysisService.getAnalysisVideoURL(
                    analysisId,
                    videoKey
                );

                if (!url) {
                    throw new Error('No video URL returned from service');
                }

                if (isMounted) {
                    urlCache[analysisId] = {
                        url,
                        expiresAt: now + ONE_HOUR_MS,
                    };
                    setVideoURL(url);
                }
            } catch (err) {
                console.error('Error fetching video URL:', err);
                if (isMounted) setVideoURL(null);
            }
        };

        fetchVideoURL();

        return () => {
            isMounted = false;
        };
    }, [activeAnalysis]);

    return videoURL;
}
