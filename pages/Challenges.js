import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { enosiStyles } from "./styles";

export default function Challenges() {
  return (
    <View style={enosiStyles.container}>
      <Text>Challenges</Text>
      <StatusBar style="auto" />
    </View>
  );
}
