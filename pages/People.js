import { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, TextInput, View } from "react-native";
import { supabase } from "../utils/Supabase";
import FeedItem from "../components/FeedItem";
import { enosiStyles } from "./styles";
import { useUser } from "../utils/UserContext";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";

export default function PeopleFeed({ route }) {
  const { state, dispatch } = useUser();
  const [profiles, setProfiles] = useState([]);
  const [peopleSearch, setPeopleSearch] = useState("");
  const navigation = useNavigation();
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

  const filteredUsers = useMemo(() => {
    return profiles.filter((person) => {
      return (person.first_name + " " + person.last_name).includes(
        peopleSearch
      );
    });
  }, [peopleSearch, profiles]);

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
          placeholder="Search. . ."
          style={enosiStyles.searchBar}
          value={peopleSearch}
          onChangeText={setPeopleSearch}
        ></TextInput>
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {filteredUsers.map((profile, key) => {
            return (
              <FeedItem
                key={key}
                name={profile.first_name + " " + profile.last_name}
                icon={{
                  url: profile.avatar_url,
                }}
                subtext={
                  profile.friends?.includes(state.session.user.id)
                    ? "Friends"
                    : undefined
                }
                onPress={() => {
                  navigation.push("Profile", { user: profile });
                }}
              ></FeedItem>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
