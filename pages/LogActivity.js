import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { Text, View, Image, SafeAreaView } from "react-native";
import { StyleSheet } from "react-native";
import { enosiStyles } from "./styles";

// X-Button: <Image source={require("../assets/close.png")} style={styles.myExit} />

export default function LogActivity() {
  return (
    <SafeAreaView>
      <Ionicons name="play-circle-outline" color="green" size={24} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  myExit: {
    top: 0,
    right: 0,
    alignSelf: "flex-end",
  },
});
