import {
  Text,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  FlatList,
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
import { Picker } from "@react-native-picker/picker";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export function LogActivity() {
  const navigation = useNavigation();
  //utilzie the user context to get user details and pass to activityData
  const { state } = useUser();
  const userId = state.session.user.id ? state.session.user.id : null;
  const [activity, setActivity] = useState("");
  const [input, setInput] = useState("");
  const [blurb, setBlurb] = useState("");
  const [inputNum, setNum] = useState(null);
  const [val, setValue] = useState(null);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState();
  const [activityTypes, setActivityTypes] = useState([
    { id: 0, title: "default" },
  ]);

  async function fetchActivityTypes() {
    try {
      let { data: activity_types, error } = await supabase
        .from("activity_types")
        .select("*");
      types_list = [];
      activity_types.map((item, idx) => {
        types_list.push({ title: item["name"], id: idx });
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
    if (!photoUri) {
      console.error("No photo URI available. Cannot upload photo.");
      return null;
    }
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
          caption: caption,
          photo_url: publicUrl,
          duration: 60,
          distance_units: val,
        };

        console.log("Inserting data:", activityData);
        const { error } = await supabase
          .from("user_activities")
          .insert([activityData])
          .select();
        if (error) throw error;
        Alert.alert("Success", "Activity logged successfully.");
      } catch (error) {
        console.error("Error logging activity:", error.message);
        Alert.alert("Error", "Failed to log activity.");
      }
    };
  };
  const unitOptions = ["miles", "kilometers", "hours", "minutes"];

  const updateActivity = (inputText) => {
    setInput(inputText);
  };

  const updateBlurb = (value) => {
    setBlurb(value);
  };
  const [selectedLanguage, setSelectedLanguage] = useState();

  return (
    <AutocompleteDropdownContextProvider headerOffset={100}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
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
              onChangeText={updateActivity}
              value={input}
            />
          </View>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="How did it go?"
              placeholderStyle={styles.textInputStyle}
              onChangeText={updateBlurb}
              value={blurb}
              multiline
              textAlignVertical="top"
            />
          </View>
          <Text style={styles.customBoxText}>Activity Details</Text>
          <AutocompleteDropdown
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={false}
            initialValue={"0"}
            onSelectItem={setActivity}
            dataSet={activityTypes}
            inputContainerStyle={[styles.inputBox, { padding: 2 }]}
            emptyResultText="Set custom"
            textInputProps={{
              placeholder: "Select activity type",
            }}
          />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
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
            <Picker
              selectedValue={selectedLanguage}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedLanguage(itemValue)
              }
              style={{ width: "40%" }}
              itemStyle={{ fontSize: 14 }}
            >
              {unitOptions.map((value) => {
                return <Picker.Item label={value} value={value}></Picker.Item>;
              })}
            </Picker>
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
                  marginTop: 10,
                },
              ]}
            >
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
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
        </ScrollView>
      </GestureHandlerRootView>
    </AutocompleteDropdownContextProvider>
  );
}

export function LogActivity2() {
  return (
    <SafeAreaView style={enosiStyles.container}>
      <Text>Challenges</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
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
    marginTop: 15,
    marginBottom: 15,
    paddingRight: 15,
    height: 120,
    maxWidth: "70%",
    backgroundColor: "#f6f6f6",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "60%",
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
    marginBottom: 10,
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
