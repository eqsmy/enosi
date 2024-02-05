import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, FlatList, StyleSheet, Text, View } from "react-native";
import { supabase } from "../utils/Supabase";
import Activity from "../components/Activity";
import { useUser } from "../utils/UserContext";
import { useIsFocused } from "@react-navigation/native";
import { enosiStyles } from "./styles";
import { SpeedDial } from "@rneui/base/dist/SpeedDial/SpeedDial";

export default function Home() {
  const [activities, setActivities] = useState([]);
  const { state, dispatch } = useUser();

  useEffect(() => {
    fetchActivities();
  }, [useIsFocused()]);

  const fetchActivities = async () => {
    try {
      await supabase
        .from("profiles")
        .select("friends")
        .eq("id", state.session.user.id)
        .single()
        .then(async (friends) => {
          let { data: activities, error2 } = await supabase
            .from("user_activities")
            .select(
              `
              *,
              profiles (
                first_name,
                last_name,
                avatar_url
              )
            `
            )
            .in("user_id", friends.data.friends ?? []);
          if (error2) throw error2;
          setActivities(activities);
        });

      /*await supabase
        .then(async (commsDict) => {
          var commsList = [];
          commsDict.data.forEach((value) => {
            commsList.push(value.id);
          });
          let { data: data2, error2 } = await supabase
            .from("user_challenges")
            .select(
              `
              *,
              profiles (first_name, last_name, avatar_url),
              challenges (photo_url, description, name)
            `
            )
            .in("community_id", commsList);
          setUserChallenges(data2);
        });*/
    } catch (error) {
      alert(error.message);
    }
  };

  const renderActivity = ({ item }) => {
    return <Activity showUser item={item}></Activity>;
  };

  return (
    <SafeAreaView
      style={activities.length == 0 ? enosiStyles.container : styles.container}
    >
      {activities.length == 0 ? (
        <Text style={{ fontSize: 15, padding: 20 }}>
          Add friends to see their activities!
        </Text>
      ) : null}
      <FlatList
        data={activities}
        renderItem={renderActivity}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.contentArea}
      />
      <StatusBar style="auto" />
      <SpeedDial />
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
