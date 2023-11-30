import {
  ScrollView,
  Text,
  TextInput,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { enosiStyles } from "./styles";
import Community from "../components/Community";
import { BasicButton } from "../components/Buttons";
import { Pressable } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import NewCommunities, { PrivacySettings } from "./NewCommunities";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../utils/Supabase";

const Stack = createStackNavigator();

function CommunitiesFeed({
  addFriendOrCommModal,
  setAddFriendOrCommModal,
  communities,
  props,
}) {
  return (
    <SafeAreaView style={enosiStyles.feedContainer}>
      <Pressable
        onPress={() => setAddFriendOrCommModal(false)}
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          backgroundColor: addFriendOrCommModal
            ? "rgba(128, 128, 128, .30)"
            : "rgba(128, 128, 128, 0)",
          zIndex: 50,
        }}
      ></Pressable>
      {addFriendOrCommModal ? (
        <View
          style={{
            backgroundColor: "white",
            paddingTop: 10,
            height: 70,
            borderBottomLeftRadius: 45,
            borderBottomRightRadius: 45,
            display: "flex",
            flexDirection: "row",
            with: "100%",
            zIndex: 100,
          }}
        >
          <View style={{ flex: 1, paddingLeft: 20, paddingRight: 10 }}>
            <BasicButton
              onPress={() => {
                setAddFriendOrCommModal(false);
                props.navigation.push("NewCommunities");
              }}
              text={"New Community"}
            ></BasicButton>
          </View>
          <View style={{ flex: 1, paddingRight: 20, paddingLeft: 10 }}>
            <BasicButton text={"Add a Friend"}></BasicButton>
          </View>
        </View>
      ) : null}
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
        <ScrollView
          style={{ width: "90%" }}
          showsVerticalScrollIndicator={false}
        >
          {communities.map((community, key) => {
            return (
              <Community
                key={key}
                name={community.name}
                icon={{
                  url: community.photo_url,
                }}
              ></Community>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default function Communities({
  addFriendOrCommModal,
  setAddFriendOrCommModal,
}) {
  const [communities, setCommunities] = useState([]);
  async function fetchCommunities() {
    try {
      let { data: comms, error } = await supabase
        .from("communities")
        .select("*");
      setCommunities(comms);
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  }
  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Communities"
        options={{
          headerRight: () => (
            <TouchableWithoutFeedback>
              <Ionicons
                onPress={() => {
                  setAddFriendOrCommModal(true);
                }}
                name="add"
                size={35}
                style={{ right: 10 }}
              />
            </TouchableWithoutFeedback>
          ),
        }}
        children={(props) => (
          <CommunitiesFeed
            props={props}
            communities={communities}
            addFriendOrCommModal={addFriendOrCommModal}
            setAddFriendOrCommModal={setAddFriendOrCommModal}
          />
        )}
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
          headerRight: () => (
            <TouchableWithoutFeedback>
              <Ionicons
                onPress={() => {
                  setAddFriendOrCommModal(true);
                }}
                name="close"
                size={35}
                style={{ right: 10 }}
                color="#FF4A00"
              />
            </TouchableWithoutFeedback>
          ),
        }}
        component={PrivacySettings}
      />
    </Stack.Navigator>
  );
}
