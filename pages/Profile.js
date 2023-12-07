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

  useEffect(() => {
    fetchProfile();
    fetchActivities();
    fetchCommunities();
  }, [useIsFocused()]);

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

  async function addFriend() {
    try {
      let { error1 } = await supabase
        .from("profiles")
        .update({
          friends: Array.from(
            new Set([...(profile?.friends || []), state.session?.user?.id])
          ),
        })
        .eq("id", route?.params?.user.id);
      if (error1) throw error1;
      await supabase
        .from("profiles")
        .select()
        .eq("id", state.session?.user?.id)
        .single()
        .then(async (data) => {
          let { error3 } = await supabase
            .from("profiles")
            .update({
              friends: Array.from(
                new Set([...(data.data?.friends || []), route?.params?.user.id])
              ),
            })
            .eq("id", state.session?.user?.id);
          console.log([...(data.data?.friends || []), route?.params?.user.id]);
          if (error3) throw error3;
        });
    } catch (error) {
      console.error("Error adding friend:", error.message);
    }
    fetchProfile();
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
              profile?.friends?.includes(state.session?.user?.id)
                ? "Friend Added!"
                : "Add Friend"
            }
            onPress={
              profile?.friends?.includes(state.session?.user?.id)
                ? undefined
                : addFriend
            }
            backgroundColor={
              profile?.friends?.includes(state.session?.user?.id)
                ? "#d2d2d2"
                : undefined
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
              backgroundColor: tabShow == "activities" ? "#61B8C2" : "white",
            },
          ]}
        >
          <Ionicons
            name="list"
            style={{ fontSize: 35 }}
            color={tabShow == "communities" ? "#61B8C2" : "white"}
          />
        </Pressable>
        <Pressable
          onPress={() => setTabShow("communities")}
          style={[
            styles.toggle,
            {
              backgroundColor: tabShow == "communities" ? "#61B8C2" : "white",
            },
          ]}
        >
          <Ionicons
            name="people"
            style={{ fontSize: 35 }}
            color={tabShow == "activities" ? "#61B8C2" : "white"}
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
    borderColor: "#61B8C2",
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
    fontFamily: "Avenir",
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
    fontFamily: "Avenir",
  },
  bio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 20,
    fontFamily: "Avenir",
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
    fontFamily: "Avenir",
  },
  activityDetails: {
    fontSize: 14,
    color: "gray",
    fontFamily: "Avenir",
  },
  activityTimestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
    fontFamily: "Avenir",
  },
});
