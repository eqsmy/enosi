import React, { useLayoutEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  SafeAreaView,
  Button,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useUser } from "../utils/UserContext";
import { supabase } from "../utils/Supabase.js";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const { state, dispatch } = useUser();
  const username = state.session?.user?.email; // Adjust to get the username if different
  const avatarUrl = state.session?.user?.avatar_url;
  const defaultAvatar = require("/Users/lyndsea/Developer/enosi/assets/profile_pic.png"); // Default avatar image path

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{marginRight: 10}}>
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
          source={avatarUrl ? { uri: avatarUrl } : defaultAvatar}
          style={styles.avatar}
        />
        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={styles.contentArea}>
        {/* Content or activities related to the user */}
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 20,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  contentArea: {
    // Style for the content area
  },
});
