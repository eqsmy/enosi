import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, SafeAreaView, Button, View } from "react-native";
import { enosiStyles } from "./styles";
import { supabase } from "../utils/Supabase"; // Adjust this path as needed
import Avatar from "../components/Avatar";
import { useUser } from "../utils/UserContext";

export default function Profile() {
  const { state, dispatch } = useUser();
  const { username } = state;
  const avatarUrl = state.session?.user?.avatar_url;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      dispatch({ type: "SET_SESSION", payload: null });
    } else {
      console.error("Error logging out:", error);
      // Handle the error appropriately
    }
  };

  return (
    <SafeAreaView style={enosiStyles.container}>
      <Text>Profile</Text>
      <View></View>
      <Button title="Logout" onPress={handleLogout} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
