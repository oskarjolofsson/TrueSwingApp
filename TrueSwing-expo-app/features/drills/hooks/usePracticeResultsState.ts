import { useEffect } from "react";
import { usePracticeActions } from "./usePracticeActions";
import { DrillRun, PracticeSession } from "features/drills/types";

interface usePracticeResultsStateReturn {
    PracticeSession: PracticeSession | null;
    DrillRuns: DrillRun[] ;
}

export function usePracticeResultsState({sessionId} : {sessionId: string | null}) : usePracticeResultsStateReturn {
    const { actions, values } = usePracticeActions();
    const { getPracticeSessionById, getResults } = actions;
    const { PracticeSession, DrillRuns } = values;

    useEffect(() => {
        const fetchResults = async () => {
            if (!sessionId) return;
            await getPracticeSessionById(sessionId);
            await getResults(sessionId);
        };
        fetchResults();
    }, [sessionId, getPracticeSessionById, getResults]);


    return {
        PracticeSession,
        DrillRuns
    }
}