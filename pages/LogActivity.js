import {
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";
import Toast from "react-native-toast-message";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useMemo } from "react";
import { Icon } from "react-native-elements";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../utils/Supabase.js";
import { useUser } from "../utils/UserContext";
import { decode as base64Decode } from "base-64";
import {
  AutocompleteDropdown,
  AutocompleteDropdownContextProvider,
} from "react-native-autocomplete-dropdown";
import { COLORS, FONTS } from "../constants.js";
import { enosiStyles } from "./styles.js";
import { useFeedStore, useUserActivityStore } from "../stores/stores.js";
import UserChallenges from "../components/UserChallenges.js";
import StandardTextInput from "../components/TextInput.js";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function LogActivity() {
  const navigation = useNavigation();
  const { state } = useUser();
  const { fetchFeed, fetchActiveChallenges } = useFeedStore();
  const userId = state.session.user.id ? state.session.user.id : null;
  const [challenge, setChallenge] = useState(null);
  const [inputNum, setNum] = useState(null);
  const [image, setImage] = useState();
  const { activeChallenges } = useFeedStore();
  const { insertUserContribution } = useUserActivityStore();
  const [blurb, setBlurb] = useState("");

  const photoUri = image;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!inputNum || !blurb) {
      Toast.show({
        type: "error",
        text1:
          "Missing caption or amount of " + challenge.unit + " contributed",
      });
      return;
    }
    Toast.show({
      type: "info",
      text1: "Posting contribution",
      autoHide: false,
    });

    const distance = parseFloat(inputNum);
    if (isNaN(distance)) {
      Toast.show({
        type: "error",
        text1: "Please enter a valid contribution quantity",
      });
      return;
    }

    if (photoUri) {
      const response = await fetch(photoUri);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        try {
          const base64 = reader.result.split(",")[1];
          const buffer = Uint8Array.from(base64Decode(base64), (c) =>
            c.charCodeAt(0)
          ).buffer;
          const imageName = `activity_${userId}_${new Date().getTime()}.jpg`;
          const resp = await supabase.storage
            .from("activity_photos")
            .upload(imageName, buffer, {
              contentType: "image/jpeg",
            })
            .catch((err) => {
              console.error(err);
            });
          const publicUrl = `https://usnnwgiufohluhxdtvys.supabase.co/storage/v1/object/public/activity_photos/${resp.data.path}`;

          insertUserContribution(
            supabase,
            userId,
            challenge.id,
            inputNum,
            challenge.unit,
            publicUrl,
            blurb,
            challenge.community_id,
            challenge.current_total,
            challenge.goal_total
          );
          fetchFeed(supabase, userId);
          fetchActiveChallenges(supabase, userId);
          Toast.show({
            type: "success",
            text1: "Contribution successfully logged",
          });
          navigation.navigate("Home");
        } catch (error) {
          console.error("Error logging activity:", error.message);
          Alert.alert("Error", "Failed to log activity.");
        }
      };
    } else {
      console.log("challenge", challenge);
      insertUserContribution(
        supabase,
        userId,
        challenge.id,
        inputNum,
        challenge.unit,
        null,
        blurb,
        challenge.community_id,
        challenge.current_total,
        challenge.goal_total
      );
      fetchFeed(supabase, userId);
      fetchActiveChallenges(supabase, userId);
      Toast.show({
        type: "success",
        text1: "Contribution successfully logged",
      });
      navigation.navigate("Home");
    }
  };

  const unitList = useMemo(() => {
    let unitOptions = [];
    activeChallenges.map((value, id) => {
      unitOptions.push(value.unit);
    });
    return [...new Set(unitOptions)];
  }, [activeChallenges]);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const challengeList = useMemo(() => {
    let challengeOptions = [];
    activeChallenges.filter((value, id) => {
      if (!selectedUnit || value.unit == selectedUnit) {
        challengeOptions.push({
          title: value.challenge_name,
          id: value.challenge_id,
          frac_complete: value.current_total / value.goal_total,
          community: value.community.community_name,
          photo_url: value.community.profile_photo_url,
          unit: value.unit,
          community_id: value.community.community_id,
          current_total: value.current_total,
          goal_total: value.goal_total,
        });
      }
    });
    return challengeOptions;
  }, [selectedUnit, activeChallenges]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
      <AutocompleteDropdownContextProvider headerOffset={100}>
        <ScrollView
          style={{
            marginHorizontal: "5%",
            width: "90%",
          }}
        >
          <Text style={{ marginTop: 20 }}>
            Which challenge are you contributing to?
          </Text>
          <View
            style={{ display: "flex", marginTop: 10, flexDirection: "row" }}
          >
            {unitList?.map((value, index) => {
              return (
                <Pressable
                  key={index}
                  style={{
                    backgroundColor:
                      value == selectedUnit
                        ? COLORS.accent
                        : COLORS.lightaccent,
                    marginHorizontal: 5,
                    borderColor: COLORS.accent,
                    borderWidth: 1,
                    borderRadius: 20,
                    padding: 6,
                    paddingHorizontal: 10,
                    width: "auto",
                  }}
                  onPress={() => {
                    setSelectedUnit(value);
                  }}
                  disabled={challenge}
                >
                  <Text
                    style={{
                      color: value == selectedUnit ? "white" : "black",
                    }}
                  >
                    {value}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={{ justifyContent: "center", alignContent: "center" }}>
            <AutocompleteDropdown
              clearOnFocus={false}
              closeOnBlur={true}
              closeOnSubmit={false}
              initialValue={"0"}
              onSelectItem={(value) => {
                setChallenge(value);
              }}
              onClear={() => setChallenge(null)}
              dataSet={challengeList}
              inputContainerStyle={[
                enosiStyles.searchBar,
                {
                  padding: 0,
                },
              ]}
              suggestionsListContainerStyle={{
                shadowRadius: 0,
                shadowOffset: 0,
                borderWidth: 1,
              }}
              emptyResultText="No challenges available"
              textInputProps={{
                placeholder: "Search for a challenge",
                style: {
                  height: 38,
                  fontSize: 14,
                },
              }}
              renderItem={(item) => {
                return (
                  <View>
                    <UserChallenges
                      item={item}
                      onPress={() => nagvigateToLogbook(item.challenge_id)}
                      showUser
                    ></UserChallenges>
                  </View>
                );
              }}
            />
          </View>
          {challenge ? (
            <View>
              <StandardTextInput
                labelText={"How did it go?"}
                placeholder="Write a contribution caption"
                value={blurb}
                onChangeText={(value) => setBlurb(value)}
                spaceAbove={20}
              />
              <Text style={{ marginTop: 10 }}>How much did you contribute?</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  marginTop: 10,
                  marginBottom: 10,
                }}
              >
                <View style={styles.numBox}>
                  <View>
                    <TextInput
                      style={{
                        fontSize: 72,
                        textAlign: "right",
                      }}
                      value={inputNum}
                      onChangeText={(x) => {
                        setNum(x);
                      }}
                      keyboardType="numeric"
                      placeholderTextColor={"#c9c9c9"}
                      placeholder={"0.0"}
                    />
                  </View>
                </View>
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: 16,
                    padding: 5,
                    fontWeight: "500",
                    textAlign: "right",
                    fontFamily: FONTS.bold,
                    paddingTop: -5,
                  }}
                >
                  {challenge.unit}{" "}
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={[
                    {
                      borderRadius: 25,
                      borderWidth: 1,
                      borderStyle: photoUri ? "solid" : "dashed",
                      borderColor: COLORS.primary,
                      justifyContent: "center",
                      textAlign: "center",
                    },
                    enosiStyles.uploadedImage,
                  ]}
                  onPress={pickImage}
                >
                  {photoUri ? (
                    <Image
                      source={{ uri: photoUri }}
                      style={enosiStyles.uploadedImage}
                    />
                  ) : (
                    <View style={{ alignItems: "center" }}>
                      <Icon
                        style={{}}
                        size={50}
                        name="add-photo-alternate"
                        color={COLORS.primary}
                      ></Icon>
                      <Text style={styles.uploadButtonText}>Choose Photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={[
                    styles.log,
                    {
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 20,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      handleSubmit();
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontFamily: FONTS.bold,
                        fontWeight: "800",
                        fontSize: 18,
                      }}
                    >
                      Post
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </AutocompleteDropdownContextProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "5%",
  },
  dropdown: {
    color: "#61B8C2",
    fontWeight: "500",
  },
  box: {
    height: height * 0.11,
    borderRadius: 15,
    borderWidth: 5,
    borderColor: "#61B8C2",
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  boxText: {
    position: "absolute",
    textAlign: "center",
    fontFamily: FONTS.bold,
    fontWeight: "600",
    fontSize: 18,
    top: 0,
    left: 0,
    right: 0,
  },
  inputBox: {
    borderRadius: 25,
    borderWidth: 3,
    borderColor: COLORS.primary,
    margin: 10,
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    padding: 12,
  },
  customBoxText: {
    fontFamily: FONTS.bold,
    fontWeight: "600",
    fontSize: 18,
    marginTop: 20,
  },
  log: {
    borderRadius: 25,
    borderWidth: 5,
    borderColor: COLORS.primary,
    height: height * 0.05,
    width: width / 3,
    backgroundColor: COLORS.primary,
  },
  numStyle: {
    fontSize: 100,
  },
  numBox: {
    padding: 10,
    margin: 5,
    height: 120,
    backgroundColor: "#f6f6f6",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "65%",
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  textInputStyle: {
    fontFamily: FONTS.medium,
    fontWeight: "600",
    fontSize: 18,
    color: "grey",
  },
  upLoadButtons: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    padding: 4,
  },
  uploadButtonText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 16,
    fontFamily: FONTS.bold,
    padding: 8,
    paddingHorizontal: 25,
    textAlign: "center",
  },
  pickUnitButton: {
    alignItems: "center",
    padding: 5,
    borderRadius: 25,
    borderColor: COLORS.primary,
    paddingTop: 0,
  },
});
