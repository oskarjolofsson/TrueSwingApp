import type { Analysis } from "features/analysis/types";

export interface ScreenProps {
    onNext: () => void | undefined;
    onBack: () => void | undefined;
}


export interface Prompt {
    desired_shot: string;
    miss: string;
    extra: string;
}


export interface CreateAnalysisResponse {
    uploadUrl: string;
    analysisId: string;
}


export interface AnalysisStatusResponse {
    status: string;
    error_message: string | null;
    analysis: Analysis | null;
}