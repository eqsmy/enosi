import {
  Text,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";

import LogActivity2 from "./LogActivity2";
import { supabase } from "../utils/Supabase";
import { useUser } from "../utils/UserContext";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const initialBgColors = {
  meditate: "transparent",
  hike: "transparent",
  swim: "transparent",
  bike: "transparent",
  run: "transparent",
  lift: "transparent",
};

export default function LogActivity() {
  //utilzie the user context to get user details and pass to activityData
  const { state } = useUser();
  const userId = state.session.user.id ? state.session.user.id : null;
  //console.log("userId", userId);

  const [bgColors, setBgColors] = useState(initialBgColors);
  const [activity, setActivity] = useState(null);
  const [input, setInput] = useState("");
  const [inputNum, setNum] = useState("0.0");
  const [val, setValue] = useState(null);

  const [textColor, setTextColor] = useState("#C9C9C9");

  const toggleBgColor = (activity) => {
    setBgColors((prevColors) => ({
      ...prevColors,
      [activity]:
        prevColors[activity] === "transparent" ? "#61B8C2" : "transparent",
    }));
  };

  //function to handle the sumibssion of the activity data
  const handleSubmit = async () => {
    // Basic form validation
    // if (!activity || !inputNum || !val) {
    //   Alert.alert("Error", "Please fill in all the fields.");
    //   return;
    // }

    // Ensure inputNum is a valid number
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
      time_spent: 0, // Update as needed
      comments: input, // Assuming 'input' is for comments
      photo_url: "", // Update if collecting a photo URL
      distance_unit: val, // Ensure val is set correctly from dropdown
      time_unit: "", // Update as needed
    };

    try {
      const { data, error } = await supabase
        .from("user_activities")
        .insert([activityData])
        .select();
      if (error) throw error;
      Alert.alert("Success", "Activity logged successfully.");
      // Reset form or navigate to another screen if necessary
    } catch (error) {
      console.error("Error logging activity:", error.message);
      Alert.alert("Error", "Failed to log activity.");
    }
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View>
        <View>
          <View
            style={{
              marginTop: height * 0.025,
              marginLeft: width * 0.07,
              marginRight: width * 0.05,
              width: width * 0.85,
            }}
          >
            <View style={styles.container}>
              <TouchableOpacity
                style={[styles.box, { backgroundColor: bgColors.meditate }]}
                onPress={() => toggleBgColor("meditate")}
              >
                <Text style={styles.boxText}>Meditate</Text>
                <Image
                  style={styles.imageBox}
                  source={require("../assets/yoga.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.box, { backgroundColor: bgColors.hike }]}
                onPress={() => toggleBgColor("hike")}
              >
                <Text style={styles.boxText}>Hike</Text>
                <Image
                  style={styles.imageBox}
                  source={require("../assets/hike.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.box, { backgroundColor: bgColors.swim }]}
                onPress={() => toggleBgColor("swim")}
              >
                <Text style={styles.boxText}>Swim</Text>
                <Image
                  style={[styles.imageBox, { marginTop: 20 }]}
                  source={require("../assets/swim.png")}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.container}>
              <TouchableOpacity
                style={[styles.box, { backgroundColor: bgColors.bike }]}
                onPress={() => toggleBgColor("bike")}
              >
                <Text style={styles.boxText}>Bike</Text>
                <Image
                  style={[styles.imageBox, { marginTop: 15 }]}
                  source={require("../assets/bike.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.box, { backgroundColor: bgColors.run }]}
                onPress={() => toggleBgColor("run")}
              >
                <Text style={styles.boxText}>Run</Text>
                <Image
                  style={styles.imageBox}
                  source={require("../assets/run.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.box, { backgroundColor: bgColors.lift }]}
                onPress={() => toggleBgColor("lift")}
              >
                <Text style={styles.boxText}>Lift</Text>
                <Image
                  style={styles.imageBox}
                  source={require("../assets/lift.png")}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.customBoxText}>Custom Activity</Text>
            <View style={styles.customBox}>
              <View
                style={{ flex: 1, justifyContent: "center", paddingLeft: 15 }}
              >
                <TextInput
                  placeholder="My Activity"
                  placeholderStyle={styles.textInputStyle}
                  onChangeText={updateActivity}
                  value={input}
                />
              </View>
            </View>

            <View style={styles.numBox}>
              <View>
                <TextInput
                  style={{
                    fontSize: 72,
                    color: textColor,
                    textAlign: "right",
                  }}
                  value={inputNum}
                  onChangeText={(x) => {
                    setNum(x);
                    setTextColor("black");
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.customBox}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
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
            </View>

            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                marginTop: 45,
              }}
            >
              <View
                style={[
                  styles.log,
                  { alignItems: "center", justifyContent: "center" },
                ]}
              >
                <TouchableOpacity onPress={handleSubmit}>
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
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.05,
  },
  dropdown: {
    color: "#61B8C2",
    fontWeight: "500",
  },
  box: {
    width: width * 0.22,
    height: height * 0.1,
    borderRadius: 15,
    borderWidth: 5,
    borderColor: "#61B8C2",
    marginHorizontal: 10,
    alignItems: "center",
  },
  boxText: {
    position: "absolute",
    textAlign: "center",
    fontFamily: "Avenir",
    fontWeight: "600",
    fontSize: 18,
    top: -35,
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
    marginLeft: -5,
    marginTop: 10,
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
    backgroundColor: "#EBEBEB",
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
});
