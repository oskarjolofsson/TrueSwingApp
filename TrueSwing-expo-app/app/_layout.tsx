import "../global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "features/auth/AuthProvider";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="(public)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}