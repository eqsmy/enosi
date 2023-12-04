import { Image, View } from "react-native";

export function LogoHeader() {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      <Image
        style={{
          margin: "auto",
          marginTop: 20,
          height: 60,
          width: "70%",
        }}
        resizeMode="contain"
        source={require("../assets/logo.png")}
      />
    </View>
  );
}
