import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  ScrollView,
  Switch,
} from "react-native";
import { enosiStyles } from "./styles";
import { BasicButton } from "../components/Buttons";
import { ProfilePreview } from "../components/ProfilePreview";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../utils/UserContext";
import { supabase } from "../utils/Supabase";
import { useMemo } from "react";
import _ from "lodash";
import { createStackNavigator } from "@react-navigation/stack";
import { COLORS } from "../constants";
import { trackEvent } from "@aptabase/react-native";

const Stack = createStackNavigator();

export function PrivacySettings() {
  const navigation = useNavigation();
  function setCommunitySettings() {
    // TODO
    navigation.navigate("SearchTab");
  }
  useEffect(() => {
    trackEvent("page_view", { page: "PrivacySettings" });
  }, []);

  const defaultPrivacyOptions = [
    {
      name: "Private Community",
      descriptionEnabled:
        "This community's challenges will only be visible to members.",
      descriptionDisabled:
        "This community's challenges will be visible to non-members.",
      status: true,
    },
    {
      name: "Searchable",
      descriptionEnabled: "This group is searchable for all users.",
      descriptionDisabled: "This group is not searchable.",
      status: false,
    },
    {
      name: "Require Approval",
      descriptionEnabled:
        "New members must be approved by a community administrator.",
      descriptionDisabled: "New members can join without approval.",
      status: false,
    },
    {
      name: "Restrict Group Invitations",
      descriptionEnabled: "Only community administrators can send invites.",
      descriptionDisabled: "Anyone in the group can send invites.",
      status: true,
    },
  ];
  const [settings, setSettings] = useState(defaultPrivacyOptions);
  return (
    <SafeAreaView style={enosiStyles.feedContainer}>
      {settings.map((option, idx) => {
        return (
          <View
            style={{
              borderBottomWidth: 1,
              display: "flex",
              width: "90%",
              flexDirection: "row",
              borderBottomColor: "#e8e8e8",
              height: 80,
              paddingTop: 20,
            }}
            key={idx}
          >
            <View style={{ width: "80%" }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {option.name}
              </Text>
              <Text
                style={{
                  marginTop: 5,
                  fontSize: 12,
                  color: "grey",
                }}
              >
                {option.status
                  ? option.descriptionEnabled
                  : option.descriptionDisabled}
              </Text>
            </View>
            <Switch
              style={{ position: "absolute", right: 0, top: 25 }}
              value={option.status}
              onValueChange={(value) => {
                const tempOptions = [...settings];
                tempOptions[idx] = {
                  ...tempOptions[idx],
                  status: !tempOptions[idx].status,
                };
                setSettings(tempOptions);
                trackEvent("change group settings", {
                  page: "community settings",
                  option: tempOptions[idx],
                  status: !tempOptions[idx].status,
                });
              }}
              trackColor={{ true: COLORS.primary, false: undefined }}
            ></Switch>
          </View>
        );
      })}
      <View style={{ position: "absolute", bottom: 50 }}>
        <BasicButton
          onPress={() => {
            setCommunitySettings();
            trackEvent("button press", {
              page: "community settings",
              action: "submit",
            });
          }}
          text={
            _.isEqual(settings, defaultPrivacyOptions)
              ? "Save Defaults"
              : "Save"
          }
        ></BasicButton>
      </View>
      <Text style={{ position: "absolute", bottom: 25, color: "grey" }}>
        (These settings can be changed later)
      </Text>
    </SafeAreaView>
  );
}

export function NewCommunities() {
  const navigation = useNavigation();
  const [communityName, setCommunityName] = useState("");
  const [peopleSearch, setPeopleSearch] = useState("");
  const { state, dispatch } = useUser();
  const [peopleToAdd, setPeopleToAdd] = useState([state.session.user.id]);
  const [profiles, setProfiles] = useState([]);
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
    trackEvent("page_view", { page: "NewCommunities" });
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return profiles.filter((person) => {
      return (person.first_name + " " + person.last_name).includes(
        peopleSearch
      );
    });
  }, [peopleSearch, profiles]);

  async function createCommunity() {
    const communityData = {
      name: communityName,
      members: peopleToAdd,
    };
    try {
      const { data, error } = await supabase
        .from("communities")
        .insert([communityData])
        .select();
      if (error) throw error;
      navigation.navigate("NewCommunityPrivacySettings");
      // Reset form or navigate to another screen if necessary
    } catch (error) {
      console.error("Error creating community:", error.message);
      alert("Error", "Failed to create community.");
    }
  }
  const renderItem = ({ item }) => {
    return (
      <ProfilePreview
        name={item.first_name + " " + item.last_name}
        avatar={{ url: item.avatar_url }}
        bio={item.bio}
        id={item.id}
        added={peopleToAdd.includes(item.id)}
        toggleAddPerson={(person) => {
          if (peopleToAdd.includes(item.id)) {
            setPeopleToAdd(
              peopleToAdd.filter((person) => {
                return person != item.id;
              })
            );
            trackEvent("changing field", {
              page: "create community",
              action: "remove friend",
            });
          } else {
            setPeopleToAdd([...peopleToAdd, person]);
            trackEvent("changing field", {
              page: "create community",
              action: "add friend",
            });
          }
        }}
      />
    );
  };

  return (
    <SafeAreaView style={enosiStyles.container}>
      <View
        style={{
          height: "100%",
          width: "90%",
          position: "absolute",
        }}
      >
        <View style={{ marginBottom: 20, marginTop: 10 }}>
          <Text>Name your community</Text>
          <TextInput
            placeholder="Community Name"
            style={enosiStyles.searchBar}
            value={communityName}
            onChangeText={(value) => {
              setCommunityName(value);
              trackEvent("changing field", {
                page: "create community",
                field: "community name",
                value: value,
              });
            }}
          ></TextInput>
        </View>
        <View style={{ height: "70%" }}>
          <View>
            <Text>Invite friends</Text>
            <TextInput
              placeholder="Search. . ."
              style={enosiStyles.searchBar}
              value={peopleSearch}
              onChangeText={(value) => {
                setPeopleSearch(value);
                trackEvent("changing field", {
                  page: "create community",
                  field: "invite friends",
                  value: value,
                });
              }}
            ></TextInput>
            <View
              style={{
                width: "100%",
                height: "80%",
                paddingTop: 10,
              }}
            >
              <FlatList
                data={filteredUsers}
                numColumns={2}
                horizontal={false}
                renderItem={renderItem}
              ></FlatList>
            </View>
          </View>
        </View>

        <View style={{ width: "100%", alignItems: "center" }}>
          <BasicButton
            backgroundColor={peopleToAdd.length > 0 ? undefined : "#BDBDBD"}
            onPress={() => {
              createCommunity();
              trackEvent("button press", {
                page: "create community",
                action: "submit",
              });
            }}
            text="Submit"
          ></BasicButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function NewCommunityFlow({}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="NewCommunities"
        options={{
          title: "New Community",
        }}
        children={(props) => <NewCommunities props={props} />}
      />
      <Stack.Screen
        name="NewCommunityPrivacySettings"
        options={{
          title: "Community Settings",
        }}
        component={PrivacySettings}
      />
    </Stack.Navigator>
  );
}
