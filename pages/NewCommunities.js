import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import { enosiStyles } from "./styles";
import { BasicButton } from "../components/Buttons";
import { ProfilePreview } from "../components/ProfilePreview";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

export function PrivacySettings() {
  return (
    <SafeAreaView style={enosiStyles.container}>
      <Text>Privacy settings toggles will go here</Text>
    </SafeAreaView>
  );
}

export default function NewCommunities() {
  const navigation = useNavigation();
  function createCommunity() {
    // TODO
    navigation.navigate("NewCommunityPrivacySettings");
  }
  const fakeProfiles = [
    {
      name: "Jane Doe",
      avatar: require("../assets/avatar2.png"),
      activities: ["hiking", "running"],
      id: 1,
    },
    {
      name: "John Smith",
      avatar: require("../assets/avatar2.png"),
      activities: ["hiking", "running"],
      id: 2,
    },
    {
      name: "Barbie",
      avatar: require("../assets/avatar2.png"),
      activities: ["hiking", "running"],
      id: 3,
    },
  ];
  const [peopleToAdd, setPeopleToAdd] = useState([]);
  const renderItem = ({ item }) => {
    return (
      <ProfilePreview
        name={item.name}
        avatar={item.avatar}
        activities={item.activities}
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
          ></TextInput>
        </View>
        <View>
          <Text>Invite friends</Text>
          <TextInput
            placeholder="Search. . ."
            style={enosiStyles.searchBar}
          ></TextInput>
          <ScrollView style={{ width: "100%", marginTop: 10 }}>
            <FlatList
              data={fakeProfiles}
              numColumns={2}
              horizontal={false}
              renderItem={renderItem}
            ></FlatList>
          </ScrollView>
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
