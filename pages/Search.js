import {
  Text,
  TextInput,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  SectionList,
} from "react-native";
import { enosiStyles } from "./styles";
import FeedItem from "../components/FeedItem";
import { BasicButton } from "../components/Buttons";
import { Pressable } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import NewCommunities, { PrivacySettings } from "./NewCommunities";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../utils/Supabase";
import { useUser } from "../utils/UserContext";
import PeopleFeed from "./People";
import Profile from "./Profile";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import {COLORS, FONTS} from "../constants.js"

const Stack = createStackNavigator();

function SearchFeed({ props }) {
  const [profiles, setProfiles] = useState([]);
  const { state, dispatch } = useUser();
  const [maxQuantities, setMaxQuantities] = useState({
    People: 5,
    Communities: 5,
  });
  const [communities, setCommunities] = useState([]);
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  async function fetchCommunities() {
    try {
      let { data: comms, error } = await supabase
        .from("communities")
        .select("*")
        .contains("members", [state.session.user.id]);
      setCommunities(comms);
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  }
  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        let { data: profs, error } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", state.session.user.id);
        setProfiles(profs);
        if (error) throw error;
      } catch (error) {
        alert(error.message);
      }
    }
    fetchUsers();
  }, [useIsFocused()]);

  const filteredData = useMemo(() => {
    return [
      {
        title: "People",
        data: profiles.filter((person) => {
          return (person.first_name + " " + person.last_name)
            .toLowerCase()
            .includes(search.toLowerCase());
        }),
      },
      {
        title: "Communities",
        data: communities.filter((community) => {
          return community.name.toLowerCase().includes(search.toLowerCase());
        }),
      },
    ];
  }, [search, profiles, communities]);

  return (
    <SafeAreaView style={enosiStyles.feedContainer}>
      <View
        style={
          communities.length == 0
            ? enosiStyles.container
            : {
                height: "100%",
                width: "90%",
                position: "absolute",
              }
        }
      >
        <TextInput
          placeholder="Search"
          style={enosiStyles.searchBar}
          value={search}
          onChangeText={setSearch}
        ></TextInput>

        <SectionList
          sections={filteredData}
          renderSectionHeader={({ section }) => {
            return (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: "white",
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginVertical: 20,
                    width: "60%",
                  }}
                >
                  {section.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      maxQuantities[section.title] > section.data.length
                        ? "lightgrey"
                        : COLORS.accent,
                    marginVertical: 20,
                    width: "30%",
                    textAlign: "right",
                    lineHeight: 20,
                    alignItems: "center",
                  }}
                  onPress={(value) =>
                    setMaxQuantities(
                      section.title == "People"
                        ? {
                            ...maxQuantities,
                            People: maxQuantities["People"] + 5,
                          }
                        : {
                            ...maxQuantities,
                            Communities: maxQuantities["Communities"] + 5,
                          }
                    )
                  }
                  disabled={maxQuantities[section.title] > section.data.length}
                >
                  See more
                </Text>
                <View
                  style={{
                    width: "10%",
                    justifyContent: "right",
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() =>
                      setMaxQuantities(
                        section.title == "People"
                          ? {
                              ...maxQuantities,
                              People: maxQuantities[section.title] == 0 ? 5 : 0,
                            }
                          : {
                              ...maxQuantities,
                              Communities:
                                maxQuantities[section.title] == 0 ? 5 : 0,
                            }
                      )
                    }
                  >
                    <Icon
                      style={{ marginVertical: 15 }}
                      size={30}
                      type="material"
                      name={
                        maxQuantities[section.title] == 0
                          ? "expand-more"
                          : "expand-less"
                      }
                    />
                  </TouchableWithoutFeedback>
                </View>
              </View>
            );
          }}
          renderItem={({ item, section, index }) => {
            if (index >= maxQuantities[section.title]) {
              return;
            }
            if (section.title == "People") {
              return (
                <FeedItem
                  name={item.first_name + " " + item.last_name}
                  icon={{
                    url: item.avatar_url,
                  }}
                  subtext={
                    item.friends?.includes(state.session.user.id)
                      ? "Friends"
                      : undefined
                  }
                  onPress={() => {
                    navigation.push("Profile", { user: item });
                  }}
                />
              );
            } else if (section.title == "Communities") {
              return (
                <FeedItem
                  name={item.name}
                  icon={{
                    url: item.photo_url,
                  }}
                ></FeedItem>
              );
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default function Search({}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="Search"
        children={(props) => <SearchFeed props={props} />}
      />
      <Stack.Screen
        name="NewCommunities"
        options={{
          title: "New Community",
        }}
        children={(props) => (
          <NewCommunities props={props} fetchCommunities={fetchCommunities} />
        )}
      />
      <Stack.Screen
        name="NewCommunityPrivacySettings"
        options={{
          title: "Community Settings",
        }}
        component={PrivacySettings}
      />
      <Stack.Screen name="People" component={PeopleFeed} />
      <Stack.Screen
        name="Profile"
        options={{ headerTitle: "" }}
        component={Profile}
      />
    </Stack.Navigator>
  );
}
