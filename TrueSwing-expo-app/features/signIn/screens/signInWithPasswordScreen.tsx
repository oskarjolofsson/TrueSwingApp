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
      className="flex-1 bg-[#09090b]"
    >
      {/* Decorative top-right corner lines */}
      <View
        className="absolute top-16 right-6 opacity-10"
        pointerEvents="none"
      >
        {[0, 14, 28].map((offset) => (
          <View
            key={offset}
            className="h-[1px] mb-[6px]"
            style={{ backgroundColor: "#60a5fa", width: 40 + offset }}
          />
        ))}
      </View>

      <View className="flex-col justify-between px-7 pt-20 pb-14">
        <View>
          {/* Back button */}
          <Pressable
            onPress={onBack}
            className="h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 active:bg-white/10"
            style={{
              shadowColor: "#60a5fa",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            }}
          >
            <ArrowLeft size={18} color="#93c5fd" />
          </Pressable>

          <View className="mt-10 mb-8">
            <Text className="text-3xl font-bold text-white">
              Sign in
            </Text>
            <Text className="mt-2 text-zinc-400">
              Sign in with your email and password.
            </Text>
          </View>
        </View>

        <View className="gap-4">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            editable={!disabled}
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-white"
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            editable={!disabled}
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-white"
          />

          {error && (
            <Text className="text-sm text-red-400">
              {error}
            </Text>
          )}

          <Pressable
            onPress={onSubmit}
            disabled={disabled}
            className="mt-2 h-14 items-center justify-center rounded-2xl bg-white active:opacity-90"
            style={{ opacity: disabled ? 0.6 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#111111" />
            ) : (
              <Text className="text-base font-semibold text-[#111111]">
                Sign in
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}