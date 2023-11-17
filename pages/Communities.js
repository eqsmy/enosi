import { ScrollView, Text, TextInput, View } from "react-native";
import { enosiStyles } from "./styles";
import Community from "../components/Community";

export default function Communities() {
  return (
    <View style={enosiStyles.feedContainer}>
      <TextInput placeholder="Search" style={enosiStyles.searchBar}></TextInput>
      <ScrollView style={{ width: "90%" }} showsVerticalScrollIndicator={false}>
        <Community
          name="LGHS Class of 2019"
          icon={require("../assets/community.png")}
        ></Community>
        <Community
          name="LGHS Class of 2019"
          icon={require("../assets/community.png")}
        ></Community>
        <Community
          name="LGHS Class of 2019"
          icon={require("../assets/community.png")}
        ></Community>
      </ScrollView>
    </View>
  );
}
