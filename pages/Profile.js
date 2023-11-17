import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, SafeAreaView, Button } from "react-native";
import { enosiStyles } from "./styles";
import { supabase } from "../utils/Supabase"; // Adjust this path as needed

export default function Profile({ setLoggedIn }) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      // Handle the error appropriately
    } else {
      setLoggedIn(false); // Update the loggedIn state in App.js
    }
  };

  return (
    <SafeAreaView style={enosiStyles.container}>
      <Text>Profile</Text>
      <Button title="Logout" onPress={handleLogout} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
