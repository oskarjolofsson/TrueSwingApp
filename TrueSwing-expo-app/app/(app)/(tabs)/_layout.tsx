import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Home, Upload, User, NotebookPen } from "lucide-react-native";

function SimpleTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    return (
        <View
            style={{
                flexDirection: "row",
                borderTopWidth: 1,
                borderTopColor: "#e5e7eb",
                backgroundColor: "#121827",
                paddingTop: 8,
                paddingBottom: 30,
            }}
        >
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                const { options } = descriptors[route.key];

                const color = isFocused ? "#ffffff" : "#6b7280";
                const size = isFocused ? 27 : 25;

                const icon =
                    options.tabBarIcon?.({
                        focused: isFocused,
                        color,
                        size,
                    });

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                return (
                    <Pressable
                        key={route.key}
                        onPress={onPress}
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 4,
                        }}
                    >
                        {icon}
                    </Pressable>
                );
            })}
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{ 
                headerShown: false,
            }}
            tabBar={(props) => <SimpleTabBar {...props} />}
        >
            <Tabs.Screen
                name="upload"
                options={{
                    title: "Upload",
                    tabBarIcon: ({ color, size }) => <Upload color={color} size={size} />,
                }}
            />
            <Tabs.Screen 
                name="index" 
                options={{ 
                    title: "Analysis",
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}   
            />
            <Tabs.Screen 
                name="profile" 
                options={{ 
                    title: "Profile",
                    tabBarIcon: ({ color, size, focused }) => <User color={color} size={size} strokeWidth={focused ? 3 : 2} />
                }}   
            />
            
        </Tabs>
    );
}