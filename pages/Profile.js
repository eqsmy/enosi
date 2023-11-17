import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView } from "react-native";
import { enosiStyles } from "./styles";

export default function Profile() {
  return (
    <SafeAreaView style={enosiStyles.container}>
      <Text>Profile</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
