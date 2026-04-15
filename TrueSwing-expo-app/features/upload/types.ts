

export interface ScreenProps {
    onNext: () => void | undefined;
    onBack: () => void | undefined;
}


export interface Prompt {
    desired_shot: string;
    miss: string;
    extra: string;
}