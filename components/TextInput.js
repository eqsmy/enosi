import { TextInput } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { enosiStyles } from "../pages/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, FONTS } from "../constants";
import { Icon } from "react-native-elements";

export default function StandardTextInput({
  labelText,
  placeholder,
  onChangeText,
  value,
  spaceAbove = 0,
  height = "auto",
  icon = null,
}) {
  return (
    <View>
      <Text style={[{ marginTop: spaceAbove }]}>{labelText}</Text>
      <View
        style={[
          enosiStyles.searchBar,
          {
            paddingTop: 8,
            height: height,
            marginBottom: 10,
            borderRadius: 30,
            flexDirection: "row",
          },
          icon && { alignItems: "center" },
        ]}
      >
        {icon && (
          <Icon
            name={icon}
            size={24}
            color={COLORS.secondary}
            type="material"
          />
        )}
        <TextInput
          placeholder={placeholder}
          onChangeText={onChangeText}
          value={value}
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}
