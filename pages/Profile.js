import React from "react";
import { StatusBar } from "expo-status-bar";
import { Text, SafeAreaView, Button } from "react-native";
import { enosiStyles } from "./styles";
import { supabase } from "../utils/Supabase"; // Adjust this path as needed
import Avatar from "../components/Avatar";
import { useUser } from "../utils/UserContext";

export default function Profile() {
  const { state, dispatch } = useUser();
  const { username } = state; // Assuming username and website are part of the state
  const avatarUrl = state.session?.user?.avatar_url; // Adjust according to how you store avatar URL

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      dispatch({ type: "SET_SESSION", payload: null });
    } else {
      console.error("Error logging out:", error);
      // Handle the error appropriately
    }
  };

  // const updateProfile = async (updatedData) => {
  //   // Implement logic to update the profile
  //   // After updating, to dispatch an action to update the state
  // };

  return (
    <SafeAreaView style={enosiStyles.container}>
      <Text>Profile</Text>
      <View>
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url) => {
            // Here you might want to update the user's avatar URL in the database
            updateProfile({ username, avatar_url: url });
            // Dispatch action if necessary to update the global state
          }}
        />
      </View>
      <Button title="Logout" onPress={handleLogout} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
