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
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import {
  FlatList,
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../utils/Supabase";
import { useUser } from "../utils/UserContext";
import { decode as base64Decode } from "base-64";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export function LogActivity1() {
  //utilzie the user context to get user details and pass to activityData
  const { state } = useUser();
  const userId = state.session.user.id ? state.session.user.id : null;
  const [activity, setActivity] = useState("");
  const [input, setInput] = useState("");
  const [inputNum, setNum] = useState(null);
  const [val, setValue] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState();

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

  const updateActivity = (inputText) => {
    setInput(inputText);
  };

  const data = [
    { label: "Miles", value: "1" },
    { label: "Kilometers", value: "2" },
    { label: "Minutes", value: "3" },
  ];
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("LogActivity2");
    console.log("Text clicked!");
  };

  const renderActivityType = ({ item }) => (
    <View style={{ marginBottom: 10, justifyContent: "space-around", flex: 1 }}>
      <Text style={styles.boxText}>{item.type}</Text>
      <TouchableOpacity
        style={[
          styles.box,
          {
            backgroundColor: item.type == activity ? "#61B8C2" : "transparent",
          },
        ]}
        onPress={() => {
          setActivity(item.type);
        }}
      >
        <Image style={styles.imageBox} source={item.image} />
      </TouchableOpacity>
    </View>
  );

  const presetActivities = [
    {
      type: "Meditate",
      image: require("../assets/activityIcons/meditate.png"),
    },
    { type: "Hike", image: require("../assets/activityIcons/hike.png") },
    { type: "Swim", image: require("../assets/activityIcons/swim.png") },
    { type: "Bike", image: require("../assets/activityIcons/bike.png") },
    { type: "Run", image: require("../assets/activityIcons/run.png") },
    { type: "Lift", image: require("../assets/activityIcons/lift.png") },
  ];
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        style={{
          marginHorizontal: "5%",
          width: "90%",
        }}
      >
        <View style={styles.container}>
          <FlatList
            data={presetActivities}
            numColumns={3}
            horizontal={false}
            scrollEnabled={false}
            renderItem={renderActivityType}
          ></FlatList>
        </View>

        <Text style={styles.customBoxText}>Custom Activity</Text>
        <View style={styles.customBox}>
          <View style={{ flex: 1, justifyContent: "center", paddingLeft: 15 }}>
            <TextInput
              placeholder="My Activity"
              placeholderStyle={styles.textInputStyle}
              onChangeText={updateActivity}
              value={input}
            />
          </View>
        </View>
        <Text style={styles.customBoxText}>Distance / Time</Text>
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
        <View
          style={[
            styles.customBox,
            {
              flex: 1,
              justifyContent: "center",
              paddingLeft: 15,
              paddingRight: 15,
            },
          ]}
        >
          <Dropdown
            style={styles.dropdown}
            data={data}
            placeholder="Select Units"
            placeholderStyle={{
              color: "#c3c3c5",
              fontWeight: "400",
              fontFamily: "Arial",
              fontSize: 15,
            }}
            labelField="label"
            valueField="value"
            onChange={(item) => {
              setValue(item.value); // Directly update the 'val' state with the selected item's value
            }}
          />
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
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text
                style={{
                  color: "white",
                  fontFamily: "Avenir",
                  fontWeight: "800",
                  fontSize: 18,
                }}
              >
                Log
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            marginTop: 30,
          }}
        >
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            presentationStyle="fullScreen"
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Optional: Add a caption and photo
              </Text>
              <TextInput
                style={styles.input}
                placeholder="How'd it go? How are you feeling? Share more about your activity!"
                onChangeText={setCaption}
                value={caption}
                multiline={true}
              />
              {photoUri && (
                <Image
                  source={{ uri: photoUri }}
                  style={styles.uploadedImage}
                />
              )}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.upLoadButtons}
                  onPress={pickImage}
                >
                  <Text style={styles.uploadButtonText}>Upload Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.upLoadButtons}
                  onPress={() => {
                    handleSubmit();
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.uploadButtonText}>Post!</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.upLoadButtons}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.uploadButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
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
  customBox: {
    borderRadius: 25,
    borderWidth: 5,
    borderColor: "#61B8C2",
    height: height * 0.05,
    margin: 10,
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
  imageBox: {
    justifyContent: "center",
    margin: "auto",
    resizeMode: "cover",
  },
  numStyle: {
    fontSize: 100,
  },
  numBox: {
    marginTop: 15,
    marginBottom: 15,
    marginLeft: width / 8,
    paddingRight: 15,
    height: height / 8,
    maxWidth: "70%",
    backgroundColor: "#f6f6f6",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  textInputStyle: {
    fontFamily: "Avenir",
    fontWeight: "600",
    fontSize: 18,
    color: "grey",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "white",
    padding: 22,
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 20,
    borderColor: "rgba(0, 0, 0, 0.1)",
    alignSelf: "center",
    width: "80%",
  },
  modalTitle: {
    marginTop: 150,
    fontFamily: "Avenir",
    fontWeight: "600",
    fontSize: 17,
    marginBottom: 10,
    alignSelf: "center",
  },
  input: {
    height: "30%",
    textAlign: "left",
    borderColor: "#f6f6f6",
    borderWidth: 1,
    borderRadius: 10,
    width: "110%",
    backgroundColor: "#f6f6f6",
    padding: 10,
  },
  uploadedImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
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
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "Avenir",
    // backgroundColor: "red",
    padding: 8,
    paddingHorizontal: 25,
  },
});
