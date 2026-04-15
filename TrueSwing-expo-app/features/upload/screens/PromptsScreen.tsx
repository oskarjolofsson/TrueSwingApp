import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { ScreenProps } from "../types";
import { useEffect, useState } from "react";
import type { UsePromptReturn } from "../hooks/usePrompt";

type Props = ScreenProps & {
    prompt: UsePromptReturn;
};

const Chip = ({ label, selected, onPress, disabled = false, activeColorClass = "bg-blue-600 border-blue-600" }: { label: string, selected: boolean, onPress: () => void, disabled?: boolean, activeColorClass?: string }) => (
    <Pressable
        onPress={disabled ? undefined : onPress}
        className={`px-4 py-2 rounded-full border m-1 ${
            disabled ? 'bg-[#111319] border-gray-800 opacity-50' : 
            selected ? activeColorClass : 'bg-[#1E2028] border-gray-700'
        }`}
    >
        <Text className={`${
            disabled ? 'text-gray-600' : 
            selected ? 'text-white' : 'text-gray-300'
        } font-medium`}>{label}</Text>
    </Pressable>
);

export default function PromptScreen({onBack, onNext, prompt}: Props) {
    const { prompt: promptData, setDesiredShot, setMiss, setExtra } = prompt;

    // Local state for Desired Shot
    const [dHeight, setDHeight] = useState<string | null>(null);
    const [dShape, setDShape] = useState<string | null>(null);

    // Local state for Typical Miss
    const [mStrike, setMStrike] = useState<string | null>(null);
    const [mHeight, setMHeight] = useState<string | null>(null);
    const [mShape, setMShape] = useState<string | null>(null);
    const [mInconsistent, setMInconsistent] = useState(false);

    // Sync local state to parent hook
    useEffect(() => {
        const desired = [dHeight, dShape].filter(Boolean).join(', ');
        setDesiredShot(desired);
    }, [dHeight, dShape]);

    useEffect(() => {
        if (mInconsistent) {
            setMiss('Inconsistent');
        } else {
            const missParts = [mStrike, mHeight, mShape].filter(Boolean);
            setMiss(missParts.join(', '));
        }
    }, [mStrike, mHeight, mShape, mInconsistent]);

    const handleInconsistentToggle = () => {
        const newVal = !mInconsistent;
        setMInconsistent(newVal);
        if (newVal) {
            setMStrike(null);
            setMHeight(null);
            setMShape(null);
        }
    };

    const renderChipGroup = (
        options: string[],
        selectedValue: string | null,
        onSelect: (value: string | null) => void,
        disabled: boolean = false,
        activeColorClass: string = "bg-blue-600 border-blue-600"
    ) => (
        <View className="flex-row flex-wrap mt-2">
            {options.map((opt) => (
                <Chip
                    key={opt}
                    label={opt}
                    selected={selectedValue === opt}
                    disabled={disabled}
                    activeColorClass={activeColorClass}
                    onPress={() => onSelect(selectedValue === opt ? null : opt)}
                />
            ))}
        </View>
    );

    return (
        <KeyboardAvoidingView 
            className="flex-1 bg-[#0B0D12]" 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView className="flex-1 px-4 pt-8" contentContainerStyle={{ paddingBottom: 100 }}>
                <Text className="text-3xl font-bold text-white mb-6">Shot Details</Text>

                {/* Desired Shot Section */}
                <View className="mb-8">
                    <Text className="text-xl font-semibold text-emerald-400 mb-2">Desired Shot</Text>
                    
                    <Text className="text-gray-400 mt-2 font-medium">Height</Text>
                    {renderChipGroup(['Low', 'Mid', 'High'], dHeight, setDHeight, false, "bg-emerald-600 border-emerald-600")}

                    <Text className="text-gray-400 mt-4 font-medium">Shape</Text>
                    {renderChipGroup(['Straight', 'Fade', 'Draw'], dShape, setDShape, false, "bg-emerald-600 border-emerald-600")}
                </View>

                {/* Typical Miss Section */}
                <View className="mb-8">
                    <Text className="text-xl font-semibold text-rose-400 mb-2">Typical Miss</Text>
                    
                    <View className="flex-row flex-wrap mt-2 mb-4">
                        <Chip 
                            label="Inconsistent" 
                            selected={mInconsistent} 
                            onPress={handleInconsistentToggle} 
                            activeColorClass="bg-rose-600 border-rose-600"
                        />
                    </View>

                    <Text className="text-gray-400 font-medium">Strike</Text>
                    {renderChipGroup(['Thin/Top', 'Thick/Duff', 'Shank', 'Toe'], mStrike, setMStrike, mInconsistent, "bg-rose-600 border-rose-600")}

                    <Text className="text-gray-400 mt-4 font-medium">Height</Text>
                    {renderChipGroup(['Too High', 'Too Low'], mHeight, setMHeight, mInconsistent, "bg-rose-600 border-rose-600")}

                    <Text className="text-gray-400 mt-4 font-medium">Shape</Text>
                    {renderChipGroup(['Slice/Fade', 'Draw/Hook'], mShape, setMShape, mInconsistent, "bg-rose-600 border-rose-600")}
                </View>

                {/* Extra Notes Section */}
                <View className="mb-8">
                    <Text className="text-xl font-semibold text-white mb-2">Additional Notes</Text>
                    <TextInput
                        className="bg-[#1E2028] text-white p-4 rounded-xl min-h-[100px] border border-gray-700"
                        placeholder="Any other details..."
                        placeholderTextColor="#6B7280"
                        multiline
                        textAlignVertical="top"
                        value={promptData.extra}
                        onChangeText={setExtra}
                    />
                </View>
            </ScrollView>

            {/* Sticky Footer */}
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-[#0B0D12] border-t border-gray-800 flex-row justify-between pb-8">
                <Pressable 
                    className="bg-[#1E2028] px-6 py-4 rounded-xl flex-1 mr-2 items-center"
                    onPress={onBack}
                >
                    <Text className="text-white font-semibold text-lg">Previous</Text>
                </Pressable>
                <Pressable 
                    className="bg-blue-600 px-6 py-4 rounded-xl flex-1 ml-2 items-center"
                    onPress={onNext}
                >
                    <Text className="text-white font-semibold text-lg">Next</Text>
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    )
}