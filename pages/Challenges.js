import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  ScrollView,
  Text,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { supabase } from "../utils/Supabase";
import { useUser } from "../utils/UserContext";
import UserChallenges from "../components/UserChallenges";
import { StatusBar } from "expo-status-bar";

function Challenges({ navigation, challenges }) {
  const { state } = useUser(); // Accessing the user context
  const [allChallenges, setAllChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);

  useEffect(() => {
    fetchAllChallenges();
    fetchUserChallenges();
  }, []);

  const fetchAllChallenges = async () => {
    try {
      let { data, error } = await supabase.from("challenges").select("*");
      if (error) throw error;
      setAllChallenges(data);
    } catch (error) {
      alert(error.message);
      console.error("Error fetching all challenges:", error.message);
    }
  };

  const fetchUserChallenges = async () => {
    try {
      let { data, error } = await supabase
        .from("user_challenges")
        .select(
          `
        *,
        profiles (first_name, last_name, avatar_url),
        challenges (photo_url, description, name)
      `
        );
      if (error) throw error;
      setUserChallenges(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const renderUserChallenges = ({ item }) => {
    return <UserChallenges showUser item={item}></UserChallenges>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput placeholder="Search Challenges" style={styles.searchBar} />
      <Text style={styles.headingText}> Available Challenges </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {allChallenges.map((challenge, index) => (
          <View style={styles.challengePreview}>
            <View key={index} style={styles.challengeCard}>
              <Image
                source={{ uri: challenge.photo_url }}
                style={styles.challengeImage}
              />
              <Text style={styles.challengeTitle}>{challenge.name}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
      <Text style={styles.headingText}> Your Challenges </Text>
      <View style={styles.containerFeed}>
        <FlatList
          data={userChallenges} 
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserChallenges}
          contentContainerStyle={styles.contentArea}
        />
      </View>
    </SafeAreaView>
  );
}

export default Challenges;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  searchBar: {
    width: "90%",
    padding: 10,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f6f6f6",
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  horizontalScroll: {
    paddingHorizontal: 10,
    height: 200,
  },
  challengePreview: {
    width: 150,
    marginRight: 10,
    alignItems: "center",
  },
  challengeImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  headingText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    width: "90%",
    padding: 10,
    marginVertical: 10,
  },
  containerFeed: {
    width: "100%",
    backgroundColor: "#ffffff",
  },
  contentArea: {
    paddingHorizontal: 10,
  },
});
