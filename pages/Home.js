import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { enosiStyles } from "./styles";

export default function Home() {
  return (
    <View style={enosiStyles.container}>
      <Text>Home</Text>
      <StatusBar style="auto" />
    </View>
  );
}
