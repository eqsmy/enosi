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
  FlatList,
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";

import { supabase } from "../utils/Supabase";
import { useUser } from "../utils/UserContext";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export function LogActivity1() {
  //utilzie the user context to get user details and pass to activityData
  const { state } = useUser();
  const userId = state.session.user.id ? state.session.user.id : null;
  const [activity, setActivity] = useState("");
  const [input, setInput] = useState("");
  const [inputNum, setNum] = useState("0.0");
  const [val, setValue] = useState(null);

  const [textColor, setTextColor] = useState("#C9C9C9");

  //function to handle the sumibssion of the activity data
  const handleSubmit = async () => {
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
      <View
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
});
