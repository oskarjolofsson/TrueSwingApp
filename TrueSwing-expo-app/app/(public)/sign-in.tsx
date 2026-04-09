import { useState } from "react";
import { Redirect } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "features/auth/AuthProvider";
import { FontAwesome } from "@expo/vector-icons";

export default function SignInScreen() {
  const { session, loading, signInWithGoogle } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && session) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  const handleSignIn = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message ?? "Failed to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-[#050816] justify-center px-5">
      <View className="rounded-[28px] border border-white/10 bg-[#111111] px-6 py-10 shadow-2xl">
        <Text className="text-white text-4xl font-bold text-center mb-3">
          Sign In
        </Text>

        <Text className="text-zinc-400 text-center text-lg mb-10">
          Get access to the best athletic trainer on the web
        </Text>

        <TouchableOpacity
          onPress={handleSignIn}
          disabled={submitting}
          activeOpacity={0.85}
          className="self-center w-full max-w-[360px] rounded-full border-2 border-[#6ea8ff] bg-white px-6 py-4 flex-row items-center justify-center"
        >
          <FontAwesome name="google" size={24} color="#4285F4" />
          <Text className="ml-4 text-black text-[18px] font-semibold">
            {submitting ? "Continuing..." : "Continue with Google"}
          </Text>
        </TouchableOpacity>

        {error ? (
          <Text className="text-red-400 text-center mt-5">{error}</Text>
        ) : null}
      </View>
    </View>
  );
}