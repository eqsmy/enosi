import React, { useLayoutEffect, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useUser } from "../utils/UserContext";
import { supabase } from "../utils/Supabase.js";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Activity from "../components/Activity";

export default function Profile() {
  const { state, dispatch } = useUser();
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchActivities();
  }, []);

  const fetchProfile = async () => {
    try {
      const userId = state.session?.user?.id;
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
      const userId = state.session?.user?.id;
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
          <TouchableOpacity onPress={handleLogout}>
            <Feather name="settings" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
      headerRightContainerStyle: {
        marginRight: -10,
      },
    });
  }, [navigation]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      dispatch({ type: "SET_SESSION", payload: null });
    } else {
      console.error("Error logging out:", error);
    }
  };

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
        <Text style={styles.bio}>{profile?.bio}</Text>
      </View>
      {!profile && (
        <Button
          title="Create Profile"
          onPress={() => navigation.navigate("CreateProfile")}
        />
      )}
      <ScrollView style={styles.contentArea}>
        {activities.map((activity, index) => (
          <Activity item={activity}></Activity>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Light grey background for the whole screen
  },
  profileHeader: {
    width: "100%", // Full width
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff", // White background for the header
    borderBottomWidth: 1,
    borderBottomColor: "#ddd", // Light border to separate from content
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60, // Circular avatar
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333", // Darker text for better readability
  },
  bio: {
    fontSize: 16,
    color: "#666", // Lighter text for the bio
    textAlign: "center", // Center the bio text if it's multiline
    paddingHorizontal: 30, // Add some horizontal padding
    marginBottom: 20, // Space before the activities
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
  },
  activityDetails: {
    fontSize: 14,
    color: "gray",
  },
  activityTimestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});
