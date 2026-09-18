import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useAppTheme } from "@/contexts/ThemeContext";

function TabIcon({ emoji, focused, color }: { emoji: string; focused: boolean; color: string }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.6 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  const { theme } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Accueil", tabBarIcon: ({ focused, color }) => <TabIcon emoji="🏠" focused={focused} color={color} /> }}
      />
      <Tabs.Screen
        name="groups"
        options={{ title: "Groupes", tabBarIcon: ({ focused, color }) => <TabIcon emoji="👥" focused={focused} color={color} /> }}
      />
      <Tabs.Screen
        name="schedule"
        options={{ title: "Planning", tabBarIcon: ({ focused, color }) => <TabIcon emoji="📅" focused={focused} color={color} /> }}
      />
      <Tabs.Screen
        name="messages/index"
        options={{ title: "Messages", tabBarIcon: ({ focused, color }) => <TabIcon emoji="💬" focused={focused} color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profil", tabBarIcon: ({ focused, color }) => <TabIcon emoji="👤" focused={focused} color={color} /> }}
      />
      <Tabs.Screen name="messages/[id]" options={{ href: null }} />
    </Tabs>
  );
}
