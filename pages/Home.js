import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView } from "react-native";
import { enosiStyles } from "./styles";

export default function Home() {
  return (
    <SafeAreaView style={enosiStyles.container}>
      <Text>Home</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
