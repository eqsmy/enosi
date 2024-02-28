import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants";

const MyCommunities = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Communities</Text>
      {/* Add your content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: FONTS.titleSize,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 16,
  },
});

export default MyCommunities;
