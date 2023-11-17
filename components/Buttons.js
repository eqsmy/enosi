import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text } from "react-native";

export function CancelButton({ navigation }) {
  return (
    <Button onPress={() => navigation.goBack()} title="Dismiss">
      <Ionicons name="close" color={"#FF4A00"} size={30} />
    </Button>
  );
}

export function BasicButton({ onPress }) {
  return (
    <Button
      onPress={onPress}
      textColor={"white"}
      style={buttonStyles.button}
      title="hi"
    >
      Login
    </Button>
  );
}

export const buttonStyles = StyleSheet.create({
  button: {
    color: "#ff04d",
    backgroundColor: "#61B8C2",
  },
});
