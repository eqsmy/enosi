import React from "react";
import { View } from "react-native";

export default function Divider({ test, style }) {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: "lightgrey",
        marginVertical: 4,
        ...style,
      }}
    />
  );
}
