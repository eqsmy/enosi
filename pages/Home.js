import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Button,
} from "react-native";
import { supabase } from "../utils/Supabase.js";
import { useUser } from "../utils/UserContext";
import { useIsFocused } from "@react-navigation/native";
import { enosiStyles } from "./styles";
import FloatingButton from "../components/FloatingButton";
import {
  useCommunitiesStore,
  useFriendStore,
  useUserActivityStore,
  useFeedStore,
  useChallengeStore,
} from "../stores/stores.js";

import { ActivityFeed } from "@components/dashboard/ActivityFeed";
import { Header } from "@components/dashboard/Header";
import { ChallengeCardCarousel } from "@components/dashboard/ChallengeCardCarousel";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const [activities, setActivities] = useState([]);
  const { state, dispatch } = useUser();

  const { fetchCommunitiesView } = useCommunitiesStore();
  const { fetchFriendsView } = useFriendStore();
  const { fetchUserContributions, fetchUsersCommunityPosts } =
    useUserActivityStore();
  const { fetchChallengesMaster } = useChallengeStore();

  const {
    feed,
    activeChallenges,
    fetchExploreFeed,
    fetchFeed,
    fetchActiveChallenges,
  } = useFeedStore();

  useEffect(() => {
    fetchFriendsView(supabase, state.session.user.id);
    fetchCommunitiesView(supabase, state.session.user.id);
    fetchUserContributions(supabase, state.session.user.id);
    fetchUsersCommunityPosts(supabase, state.session.user.id);
    fetchFeed(supabase, state.session.user.id);
    fetchActiveChallenges(supabase, state.session.user.id);
    fetchExploreFeed(supabase, state.session.user.id);
    fetchChallengesMaster(supabase);
  }, [useIsFocused()]);

  if (feed.length > 0 || activeChallenges.length > 0) {
    return (
      <SafeAreaView
        style={
          activities.length == 0 ? enosiStyles.container : styles.container
        }
      >
        <ScrollView
          style={{
            flexDirection: "column",
            flex: 1,
            width: "100%",
          }}
        >
          <Header title={"Active Challenges"} style={{ fontSize: 24 }} />
          <ChallengeCardCarousel style={{ marginBottom: 4 }} />
          <ActivityFeed />
        </ScrollView>
        <StatusBar style="auto" />
        <FloatingButton />
      </SafeAreaView>
    );
  } else {
    return <BlankFeedScreen />;
  }
}

const BlankFeedScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.blankContainer}>
      <Text style={styles.text}>Your feed is looking a little empty!</Text>
      <Text style={styles.subText}>
        Join communities and add friends to start filling it up.
      </Text>
      <Button
        title="Find Communities & Friends"
        onPress={() => navigation.navigate("Explore")} // Replace 'SearchScreen' with the actual route name
      />
      <FloatingButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentArea: {
    paddingHorizontal: 10,
  },
  blankContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});
