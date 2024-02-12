import { Button, Image, View } from "react-native";
import { Text } from "react-native-paper";
import { BasicButton } from "./Buttons";
import {COLORS, FONTS} from "../constants.js"

export function ProfilePreview({
  name,
  bio,
  avatar,
  added,
  toggleAddPerson,
  id,
}) {
  return (
    <View style={{ width: "50%", height: 140 }}>
      <View
        style={{
          margin: 5,
          borderRadius: 20,
          height: 130,
          backgroundColor: "#F6F6F6",
        }}
      >
        <Image
          style={{
            marginLeft: 15,
            marginTop: 15,
            width: 35,
            height: 35,
          }}
          resizeMode="contain"
          source={avatar}
        ></Image>
        <View
          style={{
            right: 15,
            top: 15,
            position: "absolute",
          }}
        >
          <BasicButton
            fontSize={12}
            text={added ? "Remove" : "Add"}
            onPress={() => toggleAddPerson(id)}
            backgroundColor={added ? COLORS.lightprimary : undefined}
          ></BasicButton>
        </View>
        <Text
          style={{
            marginHorizontal: 15,
            marginTop: 10,
            marginBottom: 2,
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.bold,
            marginHorizontal: 15,
            color: "#50555C",
            marginBottom: 5,
          }}
        >
          {bio}
        </Text>
      </View>
    </View>
  );
}
