import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { supabase } from "../utils/Supabase";
import { useUser } from "../utils/UserContext";
import { useIsFocused } from "@react-navigation/native";
import { enosiStyles } from "./styles";
import FloatingButton from "../components/FloatingButton";
import {
  useCommunitiesStore,
  useFriendStore,
  useUserActivityStore,
  useFeedStore,
} from "../stores/stores.js";

import { ActivityFeed } from "@components/dashboard/ActivityFeed";
import { Header } from "@components/dashboard/Header";
import { ChallengeCardCarousel } from "@components/dashboard/ChallengeCardCarousel";

export default function Home() {
  const [activities, setActivities] = useState([]);
  const { state, dispatch } = useUser();

  const { fetchCommunitiesView } = useCommunitiesStore();
  const { fetchFriendsView } = useFriendStore();
  const { fetchUserContributions, fetchUsersCommunityPosts } =
    useUserActivityStore();

  const { fetchFeed, fetchActiveChallenges } = useFeedStore();

  useEffect(() => {
    fetchFriendsView(supabase, state.session.user.id);
    fetchCommunitiesView(supabase, state.session.user.id);
    fetchUserContributions(supabase, state.session.user.id);
    fetchUsersCommunityPosts(supabase, state.session.user.id);
    fetchFeed(supabase, state.session.user.id);
    fetchActiveChallenges(supabase, state.session.user.id);
  }, [useIsFocused()]);

  return (
    <SafeAreaView
      style={activities.length == 0 ? enosiStyles.container : styles.container}
    >
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
      <StatusBar style="auto" />
      <FloatingButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentArea: {
    paddingHorizontal: 10,
  },
});
