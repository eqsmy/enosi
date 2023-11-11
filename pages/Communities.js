import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { enosiStyles } from "./styles";

export default function Communities() {
  return (
    <View style={enosiStyles.container}>
      <Text>Communities</Text>
      <StatusBar style="auto" />
    </View>
  );
}
