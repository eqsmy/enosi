import { Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";


export const Header = ({ title, style }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        paddingHorizontal: 16,
        marginTop: 8,
        ...style,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "700" }}>{title}</Text>
      <Ionicons name="ios-chevron-forward" size={20} color="black" />
    </View>
  );
};
