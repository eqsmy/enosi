import React, { useLayoutEffect, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import {
  Text,
  SafeAreaView,
  View,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { useUser } from "../utils/UserContext";
import { supabase } from "../utils/Supabase.js";
import { Feather } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Activity from "../components/Activity";
import FeedItem from "../components/FeedItem";
import { BasicButton } from "../components/Buttons";
import { COLORS, FONTS } from "../constants.js";
import { trackEvent } from "@aptabase/react-native";
import { useFriendStore } from "../stores/stores.js";

export default function Profile({ route = undefined }) {
  const { state, dispatch } = useUser();
  const navigation = useNavigation();
  const [userId, setUserId] = useState(
    route?.params?.user.id ?? state.session?.user?.id
  );
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [tabShow, setTabShow] = useState("activities");
  const [communities, setCommunities] = useState([]);
  const { insertFriend, removeFriend, friends } = useFriendStore();

  useEffect(() => {
    trackEvent("page_view", { page: "Profile" });
    fetchProfile();
    fetchActivities();
    fetchCommunities();
  }, [useIsFocused(), friends]);

  const fetchProfile = async () => {
    try {
      if (!userId) throw new Error("User not found");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    }
  };

  const fetchActivities = async () => {
    try {
      if (!userId) throw new Error("User not found");
      let { data: activities, error } = await supabase
        .from("user_activities")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });
      if (error) throw error;
      setActivities(activities || []);
    } catch (error) {
      console.error("Error fetching activities:", error.message);
    }
  };
  async function fetchCommunities() {
    try {
      let { data: comms, error } = await supabase
        .from("communities")
        .select("*")
        .contains("members", [userId]);
      setCommunities(comms || []);
      if (error) throw error;
    } catch (error) {
      console.error("Error fetching communities:", error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={
            profile?.avatar_url
              ? { uri: profile.avatar_url }
              : require("../assets/avatar.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.username}>
          {profile ? `${profile.first_name} ${profile.last_name}` : "Your Name"}
        </Text>
        <Text style={styles.bio}>{profile?.bio ?? ""}</Text>

        {userId == state.session?.user?.id ? null : (
          <BasicButton
            text={
              friends.some((friend) => friend.id == userId)
                ? "Remove Friend"
                : "Add Friend"
            }
            onPress={
              friends.some((friend) => friend.id == userId)
                ? () => {
                    removeFriend(supabase, state.session.user.id, userId);
                    trackEvent("button press", {
                      page: "friend",
                      action: "remove friend",
                      profile: profile.first_name + " " + profile.last_name,
                    });
                  }
                : () => {
                    insertFriend(supabase, state.session.user.id, userId);
                    trackEvent("button press", {
                      page: "friend",
                      action: "add friend",
                      profile: profile.first_name + " " + profile.last_name,
                    });
                  }
            }
            backgroundColor={
              friends.some((friend) => friend.id == userId)
                ? "gray"
                : COLORS.primary
            }
          ></BasicButton>
        )}
      </View>
      <View style={{ display: "flex", flexDirection: "row", height: 40 }}>
        <Pressable
          onPress={() => setTabShow("activities")}
          style={[
            styles.toggle,
            {
              backgroundColor:
                tabShow == "activities" ? COLORS.primary : "white",
            },
          ]}
        >
          <Ionicons
            name="list"
            style={{ fontSize: 35 }}
            color={tabShow == "communities" ? COLORS.primary : "white"}
          />
        </Pressable>
        <Pressable
          onPress={() => setTabShow("communities")}
          style={[
            styles.toggle,
            {
              backgroundColor:
                tabShow == "communities" ? COLORS.primary : "white",
            },
          ]}
        >
          <Ionicons
            name="people"
            style={{ fontSize: 35 }}
            color={tabShow == "activities" ? COLORS.primary : "white"}
          />
        </Pressable>
      </View>
      <ScrollView style={styles.contentArea}>
        {tabShow == "activities" ? (
          <View>
            {activities?.length == 0 ? (
              <View
                style={{
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ padding: 20 }}>
                  No activities yet! Click the "+" icon below to add your first
                  one.
                </Text>
              </View>
            ) : (
              activities?.map((activity, index) => (
                <Activity key={index} item={activity}></Activity>
              ))
            )}
          </View>
        ) : (
          <View>
            {communities?.length == 0 ? (
              <View
                style={{
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ padding: 20 }}>
                  No communities yet! Navigate to the "Communities" tab to
                  create your first one first one.
                </Text>
              </View>
            ) : (
              communities?.map((community, key) => {
                return (
                  <View style={{ marginHorizontal: "5%" }} key={key}>
                    <FeedItem
                      key={key}
                      name={community.name}
                      icon={{
                        url: community.photo_url,
                      }}
                    ></FeedItem>
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  toggle: {
    borderWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: COLORS.primary,
    width: "50%",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  profileHeader: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    fontFamily: FONTS.bold,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    fontFamily: FONTS.bold,
  },
  bio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 20,
    fontFamily: FONTS.body,
  },
  contentArea: {
    flex: 1,
  },
  activityCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    alignItems: "center",
  },
  activityImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  activityCaption: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    fontFamily: FONTS.bold,
  },
  activityDetails: {
    fontSize: 14,
    color: "gray",
    fontFamily: FONTS.body,
  },
  activityTimestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
    fontFamily: FONTS.body,
  },
});
