import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@constants";
const ProgressBar = ({
  currentValue,
  goalValue,
  size = "small",
  unit,
  showLabel = true,
}) => {
  // Calculate progress as a percentage
  const calculateProgress = (current, goal) => {
    const progress = (current / goal) * 100;
    return `${Math.round(progress)}%`; // Return as string to use in style
  };

  // Format the goal text
  const formattedGoal = `${currentValue.toLocaleString()} / ${goalValue.toLocaleString()} miles`;

  // Define size properties
  const barHeight = size === "large" ? 20 : 10;
  const fontSize = size === "large" ? 16 : 12;

  return (
    <View style={styles.progressBarContainer}>
      <View style={{...styles.progressBarBackground, height: barHeight}}>
        <View
          style={{
            ...styles.progressBarFill,
            width: calculateProgress(currentValue, goalValue), // Dynamic based on progress
          }}
        />
      </View>
      {showLabel && (
        <View style={styles.goalContainer}>
          {/* Optional: Additional elements can be added here */}
          <Text style={{...styles.goalText, fontSize: fontSize}}>{formattedGoal}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    marginTop: 4,
  },
  progressBarBackground: {
    borderRadius: 10,
    backgroundColor: COLORS.lightgrey,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  goalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  goalText: {
    color: COLORS.defaultgrey,
  },
});

export default ProgressBar;