import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text } from "react-native";
import { COLORS } from "../constants";

export function CancelButton({ navigation }) {
  return (
    <Button onPress={() => navigation.goBack()} title="Dismiss">
      <Ionicons name="close" color={"#FF4A00"} size={30} />
    </Button>
  );
}

export function BasicButton({ onPress, text, fontSize, backgroundColor }) {
  return (
    <Button
      onPress={onPress}
      textColor={"white"}
      style={{
        color: "#ff04d",
        backgroundColor: backgroundColor ?? COLORS.primary,
      }}
      labelStyle={{ fontSize: fontSize }}
    >
      {text}
    </Button>
  );
}
