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

  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile</Text>
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
