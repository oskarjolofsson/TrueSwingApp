import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";

type Props = {
  onBack: () => void;
  handleEmailSignIn: (email: string, password: string) => Promise<void>;
};

export default function EmailSignInScreen({
  onBack,
  handleEmailSignIn,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!email.trim() || !password.trim()) {
      setError("Enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await handleEmailSignIn(email.trim(), password);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-slate-950 px-6"
    >
      {/* Back button */}
      <View className="pt-16">
        <Pressable
          onPress={onBack}
          className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 active:bg-white/10"
        >
          <ArrowLeft size={18} color="white" />
        </Pressable>
      </View>

      <View className="flex-1 justify-center">
        <View className="mb-10">
          <Text className="text-3xl font-bold text-white">
            Sign in
          </Text>
        </View>

        <View className="gap-4">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#64748b"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            editable={!disabled}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white"
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#64748b"
            secureTextEntry
            editable={!disabled}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white"
          />

          {error && (
            <Text className="text-sm text-red-400">
              {error}
            </Text>
          )}

          <Pressable
            onPress={onSubmit}
            disabled={disabled}
            className="mt-2 h-14 items-center justify-center rounded-2xl bg-green-500 active:opacity-90"
            style={{ opacity: disabled ? 0.6 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-semibold text-white">
                Sign in
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}