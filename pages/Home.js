import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, FlatList, StyleSheet } from "react-native";
import { supabase } from "../utils/Supabase";
import Activity from "../components/Activity";

export default function Home() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      let { data: activities, error } = await supabase.from("user_activities")
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            avatar_url
          )
        `);
      if (error) throw error;
      setActivities(activities);
    } catch (error) {
      alert(error.message);
    }
  };

  const renderActivity = ({ item }) => {
    return <Activity showUser item={item}></Activity>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={activities}
        renderItem={renderActivity}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.contentArea}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentArea: {
    paddingHorizontal: 10,
  },
});
