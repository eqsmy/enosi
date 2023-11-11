import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { enosiStyles } from "./styles";

export default function Profile() {
  return (
    <View style={enosiStyles.container}>
      <Text>Profile</Text>
      <StatusBar style="auto" />
    </View>
  );
}
