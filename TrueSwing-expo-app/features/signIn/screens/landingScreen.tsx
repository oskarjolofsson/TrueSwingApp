
import { Text, TouchableOpacity, View, StatusBar, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
    onGoogleButtonPress: () => Promise<void>;
    onEmailButtonPress: () => void;
    submitting?: boolean;
    error?: string | null;
}

export default function LandingScreen({ onGoogleButtonPress, onEmailButtonPress, submitting, error }: Props) {

    return (
        <View className="flex-1 bg-[#09090b]">
            <StatusBar barStyle="light-content" />



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

            {/* Main content */}
            <View className="flex-1 justify-between px-7 pt-20 pb-14">

                {/* Top: Logo */}
                <View className="items-center">
                    <Image
                        source={require("../../../assets/true_swing_logo2.png")}
                        className="w-[80%]"
                        resizeMode="contain"
                    />

                    <View
                        className="mt-2 h-[2px] w-14 rounded-full self-center"
                    />
                </View>


                {/* Bottom: Sign-in button + error */}
                <View className="">
                    {/* <View
                        className="rounded-2xl"
                        style={{
                            shadowColor: "#60a5fa",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.2,
                            shadowRadius: 16,
                            borderWidth: 1,
                            borderColor: "#93c5fd1A",
                        }}
                    > */}
                    <TouchableOpacity
                        onPress={onGoogleButtonPress}
                        disabled={submitting}
                        activeOpacity={0.75}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#ffffff",
                            borderRadius: 16,
                            paddingVertical: 16,
                            paddingHorizontal: 24,
                            opacity: submitting ? 0.6 : 1,
                            shadowColor: "#ffffff",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.08,
                            shadowRadius: 20,
                        }}
                    >
                        <View
                            className="absolute left-5 w-9 h-9 rounded-full items-center justify-center"
                            style={{ backgroundColor: "#f1f3f4" }}
                        >
                            <FontAwesome name="google" size={18} color="#4285F4" />
                        </View>
                        <Text
                            style={{
                                color: "#111111",
                                fontSize: 16,
                                fontWeight: "600",
                                letterSpacing: 0.1,
                            }}
                        >
                            {submitting ? "Signing in..." : "Continue with Google"}
                        </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={onEmailButtonPress}
                        disabled={submitting}
                        activeOpacity={0.75}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#ffffffaf",
                            borderRadius: 16,
                            paddingVertical: 16,
                            paddingHorizontal: 24,
                            opacity: submitting ? 0.6 : 1,
                            shadowColor: "#ffffff",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.08,
                            shadowRadius: 20,
                            marginTop: 16,
                        }}
                    >
                        <View
                            className="absolute left-5 w-9 h-9 rounded-full items-center justify-center"
                            style={{ backgroundColor: "#f1f3f4" }}
                        >
                            <FontAwesome name="envelope" size={18} color="#79a6f0" />
                        </View>
                        <Text
                            style={{
                                color: "#111111",
                                fontSize: 16,
                                fontWeight: "600",
                                letterSpacing: 0.1,
                            }}
                        >
                            {submitting ? "Signing in..." : "Continue with Email"}
                        </Text>
                    </TouchableOpacity>
                    {/* </View> */}

                    {error ? (
                        <Text className="text-red-400 text-center mt-4 text-sm">{error}</Text>
                    ) : null}

                    <Text
                        className="text-zinc-600 text-center mt-6 mb-10"
                        style={{ fontSize: 12 }}
                    >
                        By continuing, you agree to our Terms & Privacy Policy.
                    </Text>
                </View>
            </View>
        </View>
    );

}