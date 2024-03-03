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
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { COLORS, FONTS } from "../constants.js";
import { useProfileStore } from "@stores/stores.js";

const friendsList = ["Friend 1", "Friend 2", "Friend 3"];
const communitiesList = ["Community 1", "Community 2", "Community 3"];
const postsList = ["Post 1", "Post 2", "Post 3"];

export default function ProfilePage({ route }) {
  const { state, dispatch } = useUser();
  const navigation = useNavigation();
  const [userId, setUserId] = useState(
    route?.params?.user.id ?? state.session?.user?.id
  );
  const [activeTab, setActiveTab] = useState("friends");
  const { profile, loading, fetchProfile } = useProfileStore();

  useEffect(() => {
    fetchProfile(supabase, userId);
    console.log(profile);
  }, [useIsFocused()]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!profile) {
    return <Text>Profile not found</Text>;
  }

  const renderList = () => {
    let list = [];
    if (activeTab === "friends") {
      list = friendsList;
      return profile.friends.map((item, index) => (
        <FriendListItem key={index} friend={item} />
      ));
    } else if (activeTab === "communities") {
      list = communitiesList;
    } else if (activeTab === "posts") {
      list = postsList;
    }

    return list.map((item, index) => (
      <Text key={index} style={{ marginVertical: 10 }}>
        {item}
      </Text>
    ));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={{ alignItems: "center", padding: 20 }}>
        <Image
          source={{ uri: profile.avatar_url }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 3,
            borderColor: "#f0f0f0",
          }}
        />
        <Text style={{ fontWeight: "bold", fontSize: 24, marginTop: 10 }}>
          {`${profile.first_name} ${profile.last_name}`}
        </Text>
        {profile.bio && (
          <Text
            style={{ fontStyle: "italic", color: "#555", marginBottom: 10 }}
          >
            {profile.bio}
          </Text>
        )}
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
          <Text style={{ marginRight: 20, color: "#555" }}>
            {`${profile.communities.length} communities`}
          </Text>
          <Text
            style={{ color: "#555" }}
          >{`${profile.friends.length} friends`}</Text>
        </View>
        <View style={{ flexDirection: "row", marginVertical: 10 }}>
          <TouchableOpacity
            style={{
              marginRight: 10,
              backgroundColor: COLORS.primary,
              padding: 10,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "#FFF" }}>Follow</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
        }}
      >
        <TouchableOpacity onPress={() => setActiveTab("friends")}>
          <Text
            style={{
              color: activeTab === "friends" ? COLORS.primary : "#000",
              fontWeight: activeTab === "friends" ? "bold" : "normal",
            }}
          >
            Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("communities")}>
          <Text
            style={{
              color: activeTab === "communities" ? COLORS.primary : "#000",
              fontWeight: activeTab === "communities" ? "bold" : "normal",
            }}
          >
            Communities
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("posts")}>
          <Text
            style={{
              color: activeTab === "posts" ? COLORS.primary : "#000",
              fontWeight: activeTab === "posts" ? "bold" : "normal",
            }}
          >
            Posts
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ padding: 20 }}>{renderList()}</View>
    </ScrollView>
  );
}

const FriendListItem = ({ friend }) => {
  console.log(friend);
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={{ uri: friend.avatar_url }}
        style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
      />
      <Text
        style={{ fontWeight: "bold" }}
      >{`${friend.first_name} ${friend.last_name}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
});
