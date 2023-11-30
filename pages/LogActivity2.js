import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView } from "react-native";
import { enosiStyles } from "./styles";

export default function LogActivity2() {
  return (
    <SafeAreaView style={enosiStyles.container}>
      <Text>Challenges</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
