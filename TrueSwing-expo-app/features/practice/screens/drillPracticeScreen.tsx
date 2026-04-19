
import type { Issue } from "features/issues/types";
import { usePracticeScreenState } from "features/practice/hooks/usePracticeScreenState";
import { Pressable, Text, View } from "react-native";
import LoadingState from "features/shared/components/LoadingState";
import ErrorState from "features/shared/components/ErrorState";
import type { ScreenProps } from "features/shared/types";
import type { PracticeSession } from "../types";

type Props = ScreenProps & {
    issue: Issue;
  session: PracticeSession;
}

// OnNext in this case is to go to the result screen
export default function DrillPracticeScreen({ issue, session, onNext }: Props ) {
  const props = usePracticeScreenState(issue, session, onNext);
    const hasDrill = !!props.activeDrill;
    const disabled = props.loading || !props.practiceReady || !hasDrill;

    if (props.loading) return <LoadingState title="Loading practice session..." />;
    if (props.error) return <ErrorState title="Failed to load practice session" buttonText={"End Practice Session"} onRetry={onNext} />;

    const onOpenInstructions = () => {
        console.log("Open instructions for drill");
    }


    return (
    <View className="flex-1 bg-slate-950">
      <View className="flex-1 px-5 pt-8 pb-6 justify-between">
        {/* Header */}
        <View className="items-center">
          <Text
            numberOfLines={2}
            className="text-center text-2xl font-bold text-white"
          >
            {props.activeDrill?.title}
          </Text>

          <View className="mt-4 flex-row items-center gap-2">
            <View className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Text className="text-xs font-medium text-slate-300">
                Good {props.progress.succeeded}
              </Text>
            </View>

            <View className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Text className="text-xs font-medium text-slate-300">
                Bad {props.progress.failed}
              </Text>
            </View>

            <View className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Text className="text-xs font-medium text-slate-300">
                Total {props.progress.total}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={onOpenInstructions}
            className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 active:bg-white/10"
          >
            <Text className="text-sm font-semibold text-slate-200">
              View instructions
            </Text>
          </Pressable>
        </View>

        {/* Center focus area */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm uppercase tracking-[2px] text-slate-500">
            Current rep
          </Text>

          <Text className="mt-3 text-7xl font-extrabold text-white">
            {props.progress.failed + props.progress.succeeded}
          </Text>

          <Text className="mt-4 text-center text-base text-slate-400">
            {props.remainingDrillsCount > 0
              ? `${props.remainingDrillsCount} more drill${
                  props.remainingDrillsCount === 1 ? "" : "s"
                } after this`
              : "Last drill"}
          </Text>

          {!props.practiceReady && (
            <Text className="mt-3 text-center text-sm text-amber-300">
              Practice is not ready yet
            </Text>
          )}
        </View>

        {/* Bottom actions */}
        <View>
          <View className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <View
              className="h-full rounded-full bg-white"
              style={{
                width: `${Math.min(
                  100,
                  props.progress.total > 0
                    ? ((props.progress.succeeded + props.progress.failed) / props.progress.total) * 100
                    : 0
                )}%`,
              }}
            />
          </View>

          <View className="flex-row gap-4">
            <Pressable
              disabled={disabled}
              onPress={props.handleSuccess}
              className={`flex-1 items-center rounded-3xl py-7 ${
                disabled ? "bg-emerald-500/40" : "bg-emerald-500 active:bg-emerald-600"
              }`}
            >
              <Text className="text-xl font-bold text-white">GOOD</Text>
            </Pressable>

            <Pressable
              disabled={disabled}
              onPress={props.handleFailure}
              className={`flex-1 items-center rounded-3xl py-7 ${
                disabled ? "bg-rose-500/40" : "bg-rose-500 active:bg-rose-600"
              }`}
            >
              <Text className="text-xl font-bold text-white">BAD</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}