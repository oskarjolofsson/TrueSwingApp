import { useState, useEffect } from 'react';
import analysisService from '../services/analysisService';
import type { Analysis } from '../types';

/**
 * Custom hook to fetch and cache video URL for an analysis
 * @param activeAnalysis - The current analysis with video_key or video_id
 * @returns The signed video URL or null
 */
export default function useVideoURL(activeAnalysis: Analysis | null): string | null {
    const [videoURL, setVideoURL] = useState<string | null>(null);

    useEffect(() => {
        const fetchVideoURL = async () => {
            if (!activeAnalysis) {
                setVideoURL(null);
                return;
            }

            // Check if we have a video_key (either from the analysis or from video_id)
            const videoKey = (activeAnalysis as any).video_key || `videos/${activeAnalysis.video_id}`;

            try {
                console.log('Fetching video URL for analysis:', activeAnalysis.analysis_id);
                const url = await analysisService.getAnalysisVideoURL(
                    activeAnalysis.analysis_id,
                    videoKey
                );
                setVideoURL(url);
            } catch (err) {
                console.error('Error fetching video URL:', err);
                setVideoURL(null);
            }
        };

        fetchVideoURL();
    }, [activeAnalysis]);

    return videoURL;
}
