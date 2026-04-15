import { useState } from "react";
import { Alert } from "react-native";
import { create_analysis, upload_video, confirm_upload, get_analysis_status } from "../services/uploadService"
import type { Prompt, CreateAnalysisResponse, AnalysisStatusResponse } from "../types";



export type UploadProps = {
    error: string | null;
    loading: boolean;
    startUpload: (videoUri: string, prompt: Prompt) => Promise<void>;
    checkAnalysisStatus?: (analysisId: string) => Promise<AnalysisStatusResponse | null>;
}


export function useUpload(): UploadProps {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatusResponse | null>(null);

    const startUpload = async (videoUri: string, prompt: Prompt) => {
        setError(null);
        setLoading(true);

        try {
            const createAnalaysisResponse: CreateAnalysisResponse = await create_analysis(prompt);
            await upload_video(createAnalaysisResponse.uploadUrl, videoUri);
            await confirm_upload(createAnalaysisResponse.analysisId);
        } catch (err) {
            console.error('Upload process failed:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred during upload');
            Alert.alert('Upload Error', error || 'An unknown error occurred during upload');
        } finally {
            setLoading(false);
        }
    };

    const checkAnalysisStatus = async (analysisId: string) => {
        setError(null);
        setLoading(true);
        try {
            const status: AnalysisStatusResponse = await get_analysis_status(analysisId);
            setAnalysisStatus(status);
        } catch (err) {
            console.error('Error checking analysis status:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred while checking analysis status');
        } finally {
            setLoading(false);
        }

        return analysisStatus;
    };

    return {
        error,
        loading,
        startUpload
    } as UploadProps;
}