import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFeedStore } from "../stores/stores";
import { enosiStyles } from "./styles";
import { timeAgo } from "../constants";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useRef } from "react";
import { ScrollView } from "react-native";
import { Pressable } from "react-native";
import { useState } from "react";
import { supabase } from "../utils/Supabase";
import { useUser } from "../utils/UserContext";
import { createStackNavigator } from "@react-navigation/stack";
import CommunityCard from "../components/CommunityCard";

function CommunitySearch() {
  const { communitiesSearchList } = useFeedStore();
  const searchRef = useRef(null);
  const [search, setSearch] = useState("");
  useEffect(() => {
    searchRef.current.focus();
  }, []);

  const filteredSearchList = useMemo(() => {
    return communitiesSearchList.filter((item) => {
      return item.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, communitiesSearchList]);
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
          ref={searchRef}
          placeholder="Search for communities"
          style={enosiStyles.searchBar}
          value={search}
          onChangeText={setSearch}
        ></TextInput>
        <FlatList
          data={filteredSearchList}
          style={{ marginTop: 20 }}
          keyExtractor={(item) => item.community_id.toString()}
          renderItem={({ item, index }) => (
            <View>
              <CommunityCard
                community_name={item.name}
                community_description={item.description}
                location={item.location}
                profile_photo_url={item.profile_photo_url}
                member_count={item.member_count}
                community_id={item.community_id}
              />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function CommunityTile({ data }) {
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.contributionHeader}
      onPress={() => {
        navigation.navigate("CommunityDetail", {
          communityId: data.community_id,
        });
      }}
    >
      <View>
        <Image
          source={{ uri: data.profile_photo_url }}
          style={styles.profileImage}
        />
      </View>
      <View style={{ flexDirection: "column", flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.userName}>{data.name}</Text>
          <Text style={[styles.timeAgo, { textAlign: "right" }]}>{`${timeAgo(
            data.created_at
          )}`}</Text>
        </View>
        <Text>Community created</Text>
      </View>
    </Pressable>
  );
}

function ChallengeTile({ data }) {
  const navigation = useNavigation();
  return (
    <Pressable style={styles.contributionHeader}>
      <View>
        <Image
          source={{ uri: data.profile_photo_url }}
          style={styles.profileImage}
        />
      </View>
      <View style={{ flexDirection: "column", flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.userName}>{data.community_name}</Text>
          <Text style={[styles.timeAgo, { textAlign: "right" }]}>{`${timeAgo(
            data.created_at
          )}`}</Text>
        </View>
        <Text>Joined challenge: {data.challenge_name}</Text>
      </View>
    </Pressable>
  );
}

function Explore() {
  const navigation = useNavigation();
  const { exploreFeed, fetchExploreFeed } = useFeedStore();
  const [search, setSearch] = useState("");
  const { state, dispatch } = useUser();
  const isFocused = useIsFocused();

  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        {item.type == "community" && <CommunityTile data={item} />}
        {item.type == "challenge" && <ChallengeTile data={item} />}
        {index !== exploreFeed?.length - 1 && (
          <View style={enosiStyles.separator} />
        )}
      </View>
    );
  };

  useEffect(() => {
    if (isFocused) {
      fetchExploreFeed(supabase, state.session.user.id);
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={enosiStyles.feedContainer}>
      <View
        style={
          exploreFeed.length == 0
            ? enosiStyles.container
            : {
                height: "100%",
                width: "90%",
                position: "absolute",
              }
        }
      >
        <TextInput
          placeholder="Search for communities"
          style={enosiStyles.searchBar}
          value={search}
          onChangeText={setSearch}
          onFocus={() => navigation.navigate("Search")}
        ></TextInput>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            width: "100%",
            height: "90%",
            position: "absolute",
            marginTop: 70,
          }}
        >
          {exploreFeed.map((item, index) => renderItem({ item, index }))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
const Stack = createStackNavigator();
export default function ExploreTab({}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitle: "Back",
        headerTitle: "Explore",
      }}
    >
      <Stack.Screen name="Explore" component={Explore} />
      <Stack.Screen
        name="Search"
        options={{ headerTitle: "Community Search" }}
        component={CommunitySearch}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  time: {
    color: "#555",
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
  },
  name: {
    fontWeight: "500",
    marginLeft: "auto",
  },
  image_url: {
    width: "100%",
    height: 200,
    marginBottom: 8,
    borderRadius: 8,
  },
  contributionContainerDetail: {
    backgroundColor: "#FFF",
  },
  contributionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginRight: 8,
  },
  userName: {
    fontWeight: "bold",
  },
  timeAgo: {
    color: "#555",
    textAlign: "right",
  },
  communityName: {
    fontWeight: "500",
  },
});
