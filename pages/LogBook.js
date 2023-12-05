import {
  ScrollView,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";
import { enosiStyles } from "./styles";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../utils/Supabase";

export default function LogBook({ route }) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function fetchPosts() {
      try {
        let { data: postList, error } = await supabase
          .from("logbook_posts")
          .select("*")
          .eq("challenge_id", route.params.challengeId);
        setPosts(postList);
        if (error) throw error;
      } catch (error) {
        alert(error.message);
      }
    }
    fetchPosts();
  }, []);

  const renderPost = ({ item }) => {
    return (
      <View style={styles.activityCard}>
        <Image source={{ uri: item.photo_url }} style={styles.activityImage} />
        <Text style={styles.activityCaption}>{item.group_name}</Text>
        <Text style={styles.activityDetails}>{item.text}</Text>
        <Text style={styles.activityTimestamp}>
          {new Date(item.created_at).toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={enosiStyles.feedContainer}>
      <View
        style={{
          height: "100%",
          width: "90%",
          position: "absolute",
        }}
      >
        <TextInput
          placeholder="Search"
          style={enosiStyles.searchBar}
        ></TextInput>
        <FlatList data={posts} renderItem={renderPost} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingTop: 15,
    marginVertical: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    fontFamily: "Avenir",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
    fontFamily: "Avenir",
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
    fontFamily: "Avenir",
  },
  activityDetails: {
    fontSize: 14,
    color: "black",
    marginTop: 5,
    fontFamily: "Avenir",
  },
  activityTimestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
    fontFamily: "Avenir",
  },
});
