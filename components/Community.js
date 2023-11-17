import { Image } from "react-native";
import { Text, View } from "react-native";

export default function Community({ name, icon }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        height: 80,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#e8e8e8",
      }}
    >
      <Image
        style={{ height: "80%", width: 50 }}
        resizeMode="contain"
        source={icon}
      ></Image>
      <View>
        <Text style={{ marginLeft: 15, fontWeight: "bold" }}>{name}</Text>
      </View>
    </View>
  );
}
