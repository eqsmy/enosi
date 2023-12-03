import { Image, Pressable } from "react-native";
import { Text, View } from "react-native";

export default function FeedItem({ name, icon, onPress = undefined }) {
  return (
    <Pressable
      style={{
        display: "flex",
        flexDirection: "row",
        height: 80,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#e8e8e8",
      }}
      onPress={onPress}
    >
      <Image
        style={{ height: "80%", width: 50 }}
        resizeMode="contain"
        source={icon}
      ></Image>
      <View>
        <Text style={{ marginLeft: 15, fontWeight: "bold" }}>{name}</Text>
      </View>
    </Pressable>
  );
}
