import { useState } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "features/auth/AuthProvider";
import { View } from "react-native";

import { useScreenSequence } from "features/shared/hooks/useScreenState";

import LandingScreen from "./screens/landingScreen";
import EmailSignInScreen from "./screens/signInWithPasswordScreen";


export default function SignInFlow() {

    const { session, loading, signInWithGoogle, signInWithPassword } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const Screens = ["landing", "emailSignIn"];
    const { currentScreen, goTo, next, prev } = useScreenSequence({ screens: Screens });

    if (!loading && session) {
        return <Redirect href="/(app)/(tabs)" />;
    }

    const handleGoogleSignIn = async () => {
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

    const handleEmailSignIn = async (email: string, password: string) => {
        try {
            setSubmitting(true);
            setError(null);
            await signInWithPassword(email, password);
        } catch (err: any) {
            setError(err.message ?? "Failed to sign in");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {currentScreen === "landing" && (
                <LandingScreen
                    onGoogleButtonPress={handleGoogleSignIn}
                    onEmailButtonPress={() => {
                        goTo("emailSignIn");
                    }}
                    submitting={submitting}
                    error={error}
                />
            )}
            {currentScreen === "emailSignIn" && (
                <EmailSignInScreen
                    onBack={() => goTo("landing")}
                    handleEmailSignIn={handleEmailSignIn}
                />
            )}
        </View>

    )
}
