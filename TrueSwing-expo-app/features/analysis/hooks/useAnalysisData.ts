import { useState, useEffect } from "react";
import useVideoURL from "./useVideoURL";
import type { AnalysisWithIssues } from "../types";
import type { Issue } from "features/issues/types";

interface UseAnalysisDataReturn {
    setAnalysis: (analysis: AnalysisWithIssues | null) => void;
    issue: (Issue & { confidence?: number }) | null;
    activeIssue: number;
    setActiveIssue: (index: number) => void;
    issues: (Issue & { confidence?: number })[];
    totalIssues: number;
    videoURL: string | null;
    analysisError: string | null;
}

/**
 * Custom hook to manage analysis data and current issue
 * Transforms backend Issue data to frontend display format
 */
export default function useAnalysisData(): UseAnalysisDataReturn {
    const [analysis, setAnalysis] = useState<AnalysisWithIssues | null>(null);
    const [activeIssue, setActiveIssue] = useState<number>(0);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    // Call hook at top level, not inside useEffect
    const videoURL = useVideoURL(analysis);

    const sortedIssues = analysis?.issues
        ? [...analysis.issues].sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
        : [];

    // Current issue with confidence from analysis
    const [issue, setIssue] = useState<(Issue & { confidence?: number }) | null>(null);

    useEffect(() => {
        // Check if analysis failed
        if (analysis?.success === false) {
            setAnalysisError(analysis.error_message || "Analysis failed");
            setIssue(null);
            return;
        }
        
        // Clear error if analysis is successful
        setAnalysisError(null);
        
        if (sortedIssues.length > 0 && activeIssue >= 0 && activeIssue < sortedIssues.length) {
            setIssue(sortedIssues[activeIssue]);
        } else {
            setIssue(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [analysis, activeIssue]);

    return {
        setAnalysis,
        issue,
        issues: sortedIssues,
        activeIssue,
        setActiveIssue,
        totalIssues: sortedIssues.length,
        videoURL,
        analysisError
    };
}
