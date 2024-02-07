import {
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import SimplePicker from "react-native-simple-picker";
import { Icon } from "react-native-elements";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../utils/Supabase";
import { useUser } from "../utils/UserContext";
import { decode as base64Decode } from "base-64";
import {
  AutocompleteDropdown,
  AutocompleteDropdownContextProvider,
} from "react-native-autocomplete-dropdown";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function LogActivity() {
  const navigation = useNavigation();
  //utilzie the user context to get user details and pass to activityData
  const { state } = useUser();
  const userId = state.session.user.id ? state.session.user.id : null;
  const [activity, setActivity] = useState(null);
  const [input, setInput] = useState("");
  const [blurb, setBlurb] = useState("");
  const [inputNum, setNum] = useState(null);
  const [image, setImage] = useState();
  const [activityTypes, setActivityTypes] = useState([
    { id: 0, title: "default" },
  ]);
  const [error, showError] = useState(null);

  async function fetchActivityTypes() {
    try {
      let { data: activity_types, error } = await supabase
        .from("activity_types")
        .select("*");
      types_list = [];
      activity_types.map((item, idx) => {
        types_list.push({ title: item["name"], id: idx + 1 });
      });
      setActivityTypes(types_list);
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  }
  useEffect(() => {
    fetchActivityTypes();
  }, []);

  const photoUri = image;

  const updateUserChallenges = async () => {
    try {
      const response = await supabase.rpc("add_user_contribution", {
        x: inputNum,
        activity: activity,
        unit: unit,
        user_: state.session.user.id,
      });
    } catch (error) {
      alert(error.message);
    }
  };

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
  const picker = useRef(null);

  const handleSubmit = async () => {
    if (!photoUri) {
      console.error("No photo URI available. Cannot upload photo.");
      showError("Choose a photo");
      return null;
    }

    if (!activity || !inputNum || !unit) {
      console.error("Missing activity data");
      showError("Activity information missing above");
      return;
    }
    showError(processingMessage);

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
        const distance = parseFloat(inputNum);
        if (isNaN(distance)) {
          Alert.alert("Error", "Please enter a valid number for distance.");
          return;
        }
        // Prepare data for submission
        const activityData = {
          user_id: userId,
          activity_type: activity,
          distance: distance,
          blurb: blurb,
          caption: input,
          photo_url: publicUrl,
          duration: 60,
          distance_units: unit,
        };
        updateUserChallenges();

        console.log("Inserting data:", activityData);
        const { error } = await supabase
          .from("user_activities")
          .insert([activityData])
          .select();
        if (error) throw error;
        //Alert.alert("Success", "Activity logged successfully.");
        navigation.navigate("Home");
      } catch (error) {
        console.error("Error logging activity:", error.message);
        Alert.alert("Error", "Failed to log activity.");
      }
    };
  };
  const unitOptions = ["miles", "kilometers", "hours", "minutes"];
  const [unit, setUnit] = useState("Pick unit");
  const processingMessage = "Processing...";

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
      <AutocompleteDropdownContextProvider headerOffset={100}>
        <ScrollView
          style={{
            marginHorizontal: "5%",
            width: "90%",
          }}
        >
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Activity Name"
              placeholderStyle={styles.textInputStyle}
              onChangeText={(value) => {
                setInput(value);
              }}
              value={input}
            />
          </View>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="How did it go?"
              placeholderStyle={styles.textInputStyle}
              onChangeText={(value) => setBlurb(value)}
              value={blurb}
              multiline
              textAlignVertical="top"
            />
          </View>
          <Text style={styles.customBoxText}>Activity Details</Text>
          <View style={{ justifyContent: "center", alignContent: "center" }}>
            <AutocompleteDropdown
              clearOnFocus={false}
              closeOnBlur={true}
              closeOnSubmit={false}
              initialValue={"0"}
              onChangeText={(value) => {
                setActivity(value);
              }}
              onSelectItem={(value) => {
                value && setActivity(value.title);
              }}
              dataSet={
                activity
                  ? [...activityTypes, { title: activity, id: 0 }]
                  : activityTypes
              }
              inputContainerStyle={[styles.inputBox, { padding: 2 }]}
              suggestionsListContainerStyle={{
                shadowRadius: 0,
                shadowOffset: 0,
                borderWidth: 1,
              }}
              emptyResultText="Set custom"
              textInputProps={{
                placeholder: "Select activity type",
              }}
            />
          </View>
          <SimplePicker
            ref={picker}
            options={unitOptions}
            onSubmit={(option) => {
              setUnit(option);
            }}
          />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "left",
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
            <TouchableOpacity
              onPress={() => {
                picker.current.show();
              }}
            >
              <Text
                style={{
                  color: "#61B8C2",
                  fontSize: 16,
                  padding: 5,
                  fontWeight: "500",
                  textAlign: "right",
                }}
              >
                {unit}{" "}
                <Icon
                  style={{ paddingLeft: 1 }}
                  name="edit"
                  color={"#61B8C2"}
                ></Icon>
              </Text>
            </TouchableOpacity>
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
                  borderColor: "#61B8C2",
                  justifyContent: "center",
                  textAlign: "center",
                },
                styles.uploadedImage,
              ]}
              onPress={pickImage}
            >
              {photoUri ? (
                <Image
                  source={{ uri: photoUri }}
                  style={styles.uploadedImage}
                />
              ) : (
                <Text style={styles.uploadButtonText}>Choose Photo</Text>
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
                    fontFamily: "Avenir",
                    fontWeight: "800",
                    fontSize: 18,
                  }}
                >
                  Post
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {error && (
            <Text
              style={{
                textAlign: "center",
                marginTop: 10,
                color: error == processingMessage ? "grey" : "red",
              }}
            >
              {error}
            </Text>
          )}
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
    fontFamily: "Avenir",
    fontWeight: "600",
    fontSize: 18,
    top: 0,
    left: 0,
    right: 0,
  },
  inputBox: {
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#61B8C2",
    margin: 10,
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    padding: 12,
  },
  customBoxText: {
    fontFamily: "Avenir",
    fontWeight: "600",
    fontSize: 18,
    marginTop: 15,
    marginLeft: width * 0.03,
  },
  log: {
    borderRadius: 25,
    borderWidth: 5,
    borderColor: "#61B8C2",
    height: height * 0.05,
    width: width / 3,
    backgroundColor: "#61B8C2",
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
  },
  textInputStyle: {
    fontFamily: "Avenir",
    fontWeight: "600",
    fontSize: 18,
    color: "grey",
  },

  uploadedImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    //marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "column",
    alignItems: "center",
    width: "120%",
    height: "18%",
    gap: 10,
  },
  upLoadButtons: {
    backgroundColor: "#61B8C2",
    borderRadius: 25,
    padding: 4,
  },
  uploadButtonText: {
    color: "#61B8C2",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "Avenir",
    // backgroundColor: "red",
    padding: 8,
    paddingHorizontal: 25,
    textAlign: "center",
  },
});
