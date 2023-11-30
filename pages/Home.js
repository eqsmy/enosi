import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { enosiStyles } from "./styles";
import { supabase } from "../utils/Supabase";

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
    return (
      <View style={styles.activityCard}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.profiles.avatar_url }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>
            {item.profiles.first_name} {item.profiles.last_name}
          </Text>
        </View>
        <Image source={{ uri: item.photo_url }} style={styles.activityImage} />
        <Text style={styles.activityCaption}>{item.caption}</Text>
        <Text style={styles.activityDetails}>
          Type: {item.activity_type} - Duration: {item.duration} mins -
          Distance: {item.distance} mi
        </Text>
        <Text style={styles.activityTimestamp}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
    );
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  contentArea: {
    paddingHorizontal: 10,
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
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
    marginTop: 5,
  },
  activityTimestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});
