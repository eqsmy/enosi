import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { enosiStyles } from "./styles";

export default function LogActivity() {
  return (
    <View style={enosiStyles.container}>
      <Text>Log Activity</Text>
      <StatusBar style="auto" />
    </View>
  );
}
