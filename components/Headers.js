import { Image, View } from "react-native";

export function LogoHeader() {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      <Image
        style={{
          margin: "auto",
          marginTop: 10,
          height: 50,
          width: "70%",
        }}
        source={require("../assets/logo.png")}
      />
    </View>
  );
}
