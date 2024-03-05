import { SafeAreaView, ScrollView, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ChallengeCardCarousel } from "@components/dashboard/ChallengeCardCarousel";
import { CommunityCardCarosel } from "@components/dashboard/CommunityCardCarousel";
import ActivityFeed from "@components/dashboard/ActivityFeed";
import Divider from "@components/Divider";
import { enosiStyles } from "@pages/styles";
import { Header } from "@components/dashboard/Header";

const Stack = createStackNavigator();

export function Dashboard() {
  return (
    <SafeAreaView style={enosiStyles.feedContainer}>
      <ScrollView
        style={{
          flexDirection: "column",
          flex: 1,
          width: "100%",
        }}
      >
        <Header title={"Active Challenges"} />
        <ChallengeCardCarousel style={{ marginBottom: 4 }} />
        <ActivityFeed />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function DashboardView() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: true,
        headerBackTitle: "Back",
        header: () => null,
      }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
}
