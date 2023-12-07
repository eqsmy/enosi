import { Image, Pressable } from "react-native";
import { Text, View } from "react-native";

export default function FeedItem({
  name,
  icon,
  onPress = undefined,
  subtext = undefined,
}) {
  return (
    <Pressable
      style={{
        display: "flex",
        flexDirection: "row",
        height: 80,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#e8e8e8",
        fontfamily: "Avenir",
      }}
      onPress={onPress}
    >
      <Image
        style={{ height: 50, width: 50, borderRadius: 8 }}
        resizeMode="cover"
        source={icon}
      ></Image>
      <View>
        <Text style={{ marginLeft: 15, fontWeight: "bold" }}>{name}</Text>
        {subtext ? (
          <Text
            style={{
              marginLeft: 15,
              color: "grey",
              fontSize: 12,
              marginTop: 3,
            }}
          >
            {subtext}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
