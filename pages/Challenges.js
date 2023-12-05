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
  Pressable,
} from "react-native";
import PreviewModal from "../components/PreviewModal";
import { supabase } from "../utils/Supabase";
import { useUser } from "../utils/UserContext";
import { useNavigation } from "@react-navigation/native";
import UserChallenges from "../components/UserChallenges";
import { StatusBar } from "expo-status-bar";
import { createStackNavigator } from "@react-navigation/stack";
import LogBook from "./LogBook";

function Challenges({}) {
  const navigation = useNavigation();
  const { state } = useUser();
  const [allChallenges, setAllChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [search, setSearch] = useState("");

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
      await supabase
        .from("communities")
        .select("id")
        .contains("members", [state.session.user.id])
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
        });
    } catch (error) {
      alert(error.message);
    }

    /*try {
      let { data, error } = await supabase.from("user_challenges").select(
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
    }*/
  };

  const joinChallenge = async (challengeId, communityId) => {
    try {
      const userId = state.session?.user?.id;
      const { error } = await supabase.from("user_challenges").insert([
        {
          user_id: userId,
          challenge_id: challengeId,
          community_id: communityId,
        },
      ]);
      if (error) throw error;
      fetchUserChallenges();
    } catch (error) {
      alert("There was an error joining a challenge", error.message);
    }
  };

  const nagvigateToLogbook = (challengeId) => {
    navigation.navigate("LogBook", { challengeId: challengeId });
  };

  const renderUserChallenges = ({ item }) => {
    return (
      <UserChallenges
        item={item}
        onPress={() => nagvigateToLogbook(item.challenge_id)}
        showUser
      ></UserChallenges>
    );
  };

  const openModal = (challenge) => {
    setSelectedChallenge(challenge);
    setModalVisible(true);
  };

  const handleSearch = (query) => {
    setSearch(query.toLowerCase());
  };

  const filteredChallenges = allChallenges.filter((challenge) => {
    return challenge.name.toLowerCase().includes(search);
  });

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Search"
        style={styles.searchBar}
        onChangeText={handleSearch}
        value={search}
      />
      <Text style={styles.headingText}> Available Challenges </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {filteredChallenges.map((challenge) => (
          <View key={challenge.id} style={styles.challengePreview}>
            <Pressable key={challenge.id} onPress={() => openModal(challenge)}>
              <View style={styles.challengeCard}>
                <Image
                  source={{ uri: challenge.photo_url }}
                  style={styles.challengeImage}
                />

                <Text style={styles.challengeTitle}>{challenge.name}</Text>
              </View>
            </Pressable>
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
      {modalVisible ? (
        <PreviewModal
          challenge={selectedChallenge}
          onClose={() => setModalVisible(false)}
          onJoin={joinChallenge}
        />
      ) : null}
    </SafeAreaView>
  );
}

const Stack = createStackNavigator();

export function ChallengesStack({}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="Challenges"
        style={{ headerTitle: "Challenges" }}
        component={Challenges}
      />
      <Stack.Screen
        name="LogBook"
        component={LogBook}
        options={{
          headerTitle: "Log Book",
          tabBarButton: () => null,
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default Challenges;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
    fontFamily: "Avenir",
  },
  searchBar: {
    width: "97%",
    padding: 10,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f6f6f6",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    fontFamily: "Avenir",
  },
  horizontalScroll: {
    paddingHorizontal: 10,
    height: 200,
    width: "100%",
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
    fontFamily: "Avenir",
  },
  headingText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    width: "100%",
    padding: 10,
    marginVertical: 10,
    fontFamily: "Avenir",
  },
  containerFeed: {
    flex: 80,
    width: "100%",
    backgroundColor: "#ffffff",
  },
  contentArea: {
    paddingHorizontal: 10,
  },
});
