import { Image, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import { COLORS } from "../constants";
import { enosiStyles } from "../pages/styles";
import { Text } from "react-native";

export default function StandardPhotoPicker({
  photoUri,
  pickImage,
  labelText,
  iconName,
  iconFamily,
  iconSize,
}) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        style={[
          {
            borderRadius: 25,
            borderWidth: 1,
            borderStyle: photoUri ? "solid" : "dashed",
            borderColor: COLORS.primary,
            justifyContent: "center",
            textAlign: "center",
          },
          enosiStyles.uploadedImage,
        ]}
        onPress={pickImage}
      >
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={enosiStyles.uploadedImage} />
        ) : (
          <View style={{ alignItems: "center" }}>
            <Icon
              size={iconSize}
              name={iconName}
              color={COLORS.primary}
              type={iconFamily}
            ></Icon>
            <Text style={enosiStyles.uploadButtonText}>{labelText}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
