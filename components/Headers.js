import { Image, View } from "react-native";

export function LogoHeader() {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      <Image
        style={{
          margin: "auto",
          marginTop: 40,
          height: 60,
          width: "80%",
        }}
        resizeMode="contain"
        source={require("../assets/logocray.png")}
      />
    </View>
  );
}
