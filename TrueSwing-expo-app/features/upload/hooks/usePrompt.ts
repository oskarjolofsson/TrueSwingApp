import type { Prompt } from "../types";
import { useState } from "react";

export type UsePromptReturn = {
    prompt: Prompt;
    setDesiredShot: (shot: string) => void;
    setMiss: (miss: string) => void;
    setExtra: (extra: string) => void;
}

export function usePrompt() {
    const [prompt, setPrompt] = useState<Prompt>({
        desired_shot: "",
        miss: "",
        extra: ""
    });
    const setDesiredShot = (shot: string) => setPrompt(prev => ({ ...prev, desired_shot: shot }));
    const setMiss = (miss: string) => setPrompt(prev => ({ ...prev, miss }));
    const setExtra = (extra: string) => setPrompt(prev => ({ ...prev, extra }));


    return {
        prompt
        , setDesiredShot, setMiss, setExtra
     } as UsePromptReturn;
}