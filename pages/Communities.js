import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView } from "react-native";
import { enosiStyles } from "./styles";

export default function Communities() {
  return (
    <SafeAreaView style={enosiStyles.container}>
      <Text>Communities</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
