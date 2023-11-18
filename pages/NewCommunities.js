import { StatusBar } from "expo-status-bar";
import { Text, View, SafeAreaView, TextInput } from "react-native";
import { enosiStyles } from "./styles";

function LilFriend() {
  // for lil friend tiles that come up when you search
  // documentation for grid stuff: https://reactnative.dev/docs/flexbox#row-gap-column-gap-and-gap
}

export default function NewCommunities() {
  return (
    <SafeAreaView style={enosiStyles.container}>
      <View
        style={{
          height: "100%",
          width: "90%",
          position: "absolute",
        }}
      >
        <View style={{ marginBottom: 20, marginTop: 10 }}>
          <Text>Name your community</Text>
          <TextInput
            placeholder="Community Name"
            style={enosiStyles.searchBar}
          ></TextInput>
        </View>
        <View>
          <Text>Invite friends</Text>
          <TextInput
            placeholder="Search"
            style={enosiStyles.searchBar}
          ></TextInput>
        </View>
      </View>
    </SafeAreaView>
  );
}
