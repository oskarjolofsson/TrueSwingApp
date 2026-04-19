import { useState, useEffect, useCallback, useRef } from 'react';
import { DrillService } from 'features/practice/services/drillService';
import { usePracticeActions } from './usePracticeActions';
import type { Issue } from 'features/issues/types';
import type { Drill, DrillRun, PracticeSession } from '../types';

const REPS_PER_DRILL = 12;

interface UsePracticeDrillsReturn {
    activeDrill: Drill | null;
    remainingDrillsCount: number;
    practiceReady: boolean;
    progress: {
        succeeded: number;
        failed: number;
        total: number;
    };
    handleSuccess: () => void;
    handleFailure: () => void;
    loading: boolean;
    error: string | null;
}

export function usePracticeScreenState(
        issue: Issue,
        session: PracticeSession | null,
        onSessionCompleted: () => void
    ): UsePracticeDrillsReturn
{

    const { actions, state } = usePracticeActions();
    const { startDrill, endDrill, endSession } = actions;

    const [allDrills, setDrills] = useState<Drill[]>([]);
    const [screenLoading, setScreenLoading] = useState<boolean>(true);
    const [screenError, setScreenError] = useState<string | null>(null);

    const [currentDrillIndex, setCurrentDrillIndex] = useState<number>(0);
    const [currentDrillRun, setCurrentDrillRun] = useState<DrillRun | null>(null);
    const [flowError, setFlowError] = useState<string | null>(null);
    const hasInitializedRef = useRef(false);
    const lastCompletedRunIdRef = useRef<string | null>(null);

    const drillService = new DrillService();

    const activeDrill = currentDrillIndex < allDrills.length ? allDrills[currentDrillIndex] : null;
    const succeeded = currentDrillRun?.successful_reps ?? 0;
    const failed = currentDrillRun?.failed_reps ?? 0;

    // Fetch issue and all drills for the issue when the component mounts or when the issueId changes
    useEffect(() => {
        const fetchIssueAndDrills = async () => {
            if (!issue) {
                setDrills([]);
                setScreenLoading(false);
                return;
            }

            try {
                setScreenLoading(true);
                setScreenError(null);
                const fetchedDrills = await drillService.getDrillsByIssue(issue.id);
                setDrills(fetchedDrills);
            } catch (err) {
                console.error('Error fetching drills or issue:', err);
                setScreenError(err instanceof Error ? err.message : 'Internal error occurred while loading drills');
                setDrills([]);
            } finally {
                setScreenLoading(false);
            }
        };

        fetchIssueAndDrills();

    }, [issue]);

    // Reset practice state when issue changes
    useEffect(() => {
        hasInitializedRef.current = false;
        setCurrentDrillIndex(0);
        setCurrentDrillRun(null);
        setFlowError(null);
        lastCompletedRunIdRef.current = null;
    }, [issue, session]);

    // Initialize practice session and start first drill when drills are loaded and issue is valid
    useEffect(() => {
        let isMounted = true;

        const initializePractice = async () => {
            if (!issue) {
                return;
            }

            if (!session) {
                hasInitializedRef.current = true;
                setFlowError('Practice session is missing. Please go back and start practice again.');
                return;
            }

            if (allDrills.length === 0 || hasInitializedRef.current) {
                console.warn('Skipping practice initialization due to missing drills or already initialized state. allDrills.length:', allDrills.length, 'hasInitializedRef.current:', hasInitializedRef.current);
                return;
            }

            try {
                hasInitializedRef.current = true;
                setFlowError(null);
                const firstDrillRun = await startDrill(session.id, allDrills[0].id);
                if (!isMounted) return;

                setCurrentDrillRun(firstDrillRun);
            } catch (err) {
                if (!isMounted) return;
                hasInitializedRef.current = false;
                setFlowError(err instanceof Error ? err.message : 'Failed to initialize practice');
            }
        };

        initializePractice();

        return () => {
            isMounted = false;
        };
    }, [issue, session, allDrills.length, startDrill]);

    const moveToNextDrill = useCallback(async (completedDrillRun: DrillRun) => {
        console.log('Attempting to move to next drill. completedDrillRun:', completedDrillRun, 'currentDrillIndex:', currentDrillIndex);  // Debug log to trace drill completion
        if (!session) return;    // Guard against missing practice session
        const nextIndex = currentDrillIndex + 1;                    // Calculate next drill index
        await endDrill(completedDrillRun);                       // End current drill run before moving to the next one
        console.log('Ended drill run with ID:', completedDrillRun.id);  // Debug log to confirm drill run ended

        if (nextIndex >= allDrills.length) {
            // No more drills, end session and navigate to results
            console.log('All drills completed. Ending practice session with ID:', session.id);  // Debug log to confirm all drills are done
            await endSession(session.id);
            onSessionCompleted();
            return;
        }

        // Start next drill

        const nextDrillRun = await startDrill(session.id, allDrills[nextIndex].id);
        console.log('started next drill run with success:', nextDrillRun.successful_reps, 'and failure:', nextDrillRun.failed_reps);  // Debug log to confirm next drill started
        setCurrentDrillRun(nextDrillRun);
        setCurrentDrillIndex(nextIndex);
    }, [allDrills, currentDrillIndex, endDrill, endSession, session, startDrill, onSessionCompleted]);


    const handleRep = useCallback((repType: 'successful_reps' | 'failed_reps') => {
        if (!session || !currentDrillRun) {
            console.warn('Attempted to record a rep without an active practice session or drill run');
            return;
        }

        setCurrentDrillRun((previousDrillRun) => {
            if (!previousDrillRun) {
                return previousDrillRun;
            }

            const currentTotalReps = previousDrillRun.successful_reps + previousDrillRun.failed_reps;
            if (currentTotalReps >= REPS_PER_DRILL) {
                return previousDrillRun;
            }

            const updatedDrillRun = {
                ...previousDrillRun,
                [repType]: previousDrillRun[repType] + 1,
            };

            return updatedDrillRun;
        });
    }, [currentDrillRun, session]);

    useEffect(() => {
        if (!currentDrillRun || !session) {
            return;
        }

        const updatedTotalReps = currentDrillRun.successful_reps + currentDrillRun.failed_reps;
        if (updatedTotalReps !== REPS_PER_DRILL) {
            return;
        }

        if (lastCompletedRunIdRef.current === currentDrillRun.id) {
            return;
        }

        lastCompletedRunIdRef.current = currentDrillRun.id;
        void moveToNextDrill(currentDrillRun);
    }, [currentDrillRun, session, moveToNextDrill]);

    const handleSuccess = useCallback(() => {
        void handleRep('successful_reps');
    }, [handleRep]);

    const handleFailure = useCallback(() => {
        void handleRep('failed_reps');
    }, [handleRep]);

    const remainingDrillsCount = Math.max(0, allDrills.length - currentDrillIndex - 1);
    const practiceReady = Boolean(session && currentDrillRun);
    const isInitializingPractice = !screenLoading && allDrills.length > 0 && !flowError && !practiceReady;

    return {
        activeDrill,
        remainingDrillsCount,
        practiceReady,
        progress: {
            succeeded,
            failed,
            total: REPS_PER_DRILL,
        },
        handleSuccess,
        handleFailure,
        loading: screenLoading || state.loading || isInitializingPractice,
        error: screenError || flowError || state.error,
    };
}