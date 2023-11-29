import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  TextInput,
} from "react-native";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { enosiStyles } from "./styles";
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";

import LogActivity2 from "./LogActivity2";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function LogActivity() {
  const [meditatebg, setmeditatebg] = useState("transparent");
  const [hikebg, sethikebg] = useState("transparent");
  const [swimbg, setswimbg] = useState("transparent");

  const [bikebg, setbikebg] = useState("transparent");
  const [runbg, setrunbg] = useState("transparent");
  const [liftbg, setliftbg] = useState("transparent");

  const toggleMeditateBg = () => {
    setmeditatebg((prevBg) =>
      prevBg === "transparent" ? "#61B8C2" : "transparent"
    );
  };

  const toggleHikeBg = () => {
    sethikebg((prevBg) =>
      prevBg === "transparent" ? "#61B8C2" : "transparent"
    );
  };

  const toggleSwimBg = () => {
    setswimbg((prevBg) =>
      prevBg === "transparent" ? "#61B8C2" : "transparent"
    );
  };

  const toggleBikeBg = () => {
    setbikebg((prevBg) =>
      prevBg === "transparent" ? "#61B8C2" : "transparent"
    );
  };

  const toggleRunBg = () => {
    setrunbg((prevBg) =>
      prevBg === "transparent" ? "#61B8C2" : "transparent"
    );
  };

  const toggleLiftBg = () => {
    setliftbg((prevBg) =>
      prevBg === "transparent" ? "#61B8C2" : "transparent"
    );
  };

  const [activity, setActivity] = useState(null);
  const chooseActivity = (y) => {
    setActivity(y);
  };

  const [input, setInput] = useState("");
  const updateActivity = (inputText) => {
    setInput(inputText);
  };

  const [inputNum, setNum] = useState("0.0");

  const updateNum = (inputNum) => {
    setNum(inputNum);
  };

  const [textColor, setTextColor] = useState("#C9C9C9");

  const [val, setValue] = useState(null);
  const DropdownVal = () => {
    setValue(val);
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
                style={[styles.box, { backgroundColor: meditatebg }]}
                onPress={toggleMeditateBg}
              >
                <Text style={styles.boxText}>Meditate</Text>
                <Image
                  style={styles.imageBox}
                  source={require("../assets/yoga.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.box, { backgroundColor: hikebg }]}
                onPress={toggleHikeBg}
              >
                <Text style={styles.boxText}>Hike</Text>
                <Image
                  style={styles.imageBox}
                  source={require("../assets/hike.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.box, { backgroundColor: swimbg }]}
                onPress={toggleSwimBg}
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
                style={[styles.box, { backgroundColor: bikebg }]}
                onPress={toggleBikeBg}
              >
                <Text style={styles.boxText}>Bike</Text>
                <Image
                  style={[styles.imageBox, { marginTop: 15 }]}
                  source={require("../assets/bike.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.box, { backgroundColor: runbg }]}
                onPress={toggleRunBg}
              >
                <Text style={styles.boxText}>Run</Text>
                <Image
                  style={styles.imageBox}
                  source={require("../assets/run.png")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.box, { backgroundColor: liftbg }]}
                onPress={toggleLiftBg}
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
                    DropdownVal();
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
                <TouchableOpacity onPress={handlePress}>
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
