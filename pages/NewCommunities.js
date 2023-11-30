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

export function PrivacySettings() {
  const navigation = useNavigation();
  function setCommunitySettings() {
    // TODO
    navigation.navigate("Communities");
  }

  const defaultPrivacyOptions = [
    {
      name: "Private Community",
      descriptionEnabled: "This community is private.",
      descriptionDisabled: "This community is public.",
      status: false,
    },
    {
      name: "Searchable",
      descriptionEnabled: "This group is searchable for all users.",
      descriptionDisabled: "This group is not searchable.",
      status: false,
    },
    {
      name: "Require Approval",
      descriptionEnabled: "New members must be approved.",
      descriptionDisabled: "New members can join without approval.",
      status: false,
    },
    {
      name: "Restrict Invitations",
      descriptionEnabled: "Only community admins can send invites.",
      descriptionDisabled: "Anyone in the group can send invites.",
      status: false,
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
            <View>
              <Text style={{ fontWeight: "bold" }}>{option.name}</Text>
              <Text style={{ marginTop: 5 }}>
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
              }}
              trackColor={{ true: "#FF4A00", false: undefined }}
            ></Switch>
          </View>
        );
      })}
      <View style={{ position: "absolute", bottom: 50, width: 150 }}>
        <BasicButton onPress={setCommunitySettings} text={"Done"}></BasicButton>
      </View>
    </SafeAreaView>
  );
}

export default function NewCommunities({ fetchCommunities }) {
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
      fetchCommunities();
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
          } else {
            setPeopleToAdd([...peopleToAdd, person]);
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
            onChangeText={setCommunityName}
          ></TextInput>
        </View>
        <View>
          <Text>Invite friends</Text>
          <TextInput
            placeholder="Search. . ."
            style={enosiStyles.searchBar}
            value={peopleSearch}
            onChangeText={setPeopleSearch}
          ></TextInput>
          <View style={{ width: "100%", marginTop: 10 }}>
            <FlatList
              data={filteredUsers}
              numColumns={2}
              horizontal={false}
              renderItem={renderItem}
            ></FlatList>
          </View>
        </View>

        <View style={{ width: "100%", alignItems: "center", paddingTop: 20 }}>
          <BasicButton
            backgroundColor={peopleToAdd.length > 0 ? undefined : "#BDBDBD"}
            onPress={createCommunity}
            text="Submit"
          ></BasicButton>
        </View>
      </View>
    </SafeAreaView>
  );
}
