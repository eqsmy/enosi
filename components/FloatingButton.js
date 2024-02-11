import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  SafeAreaView,
} from "react-native";
import React, { useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {COLORS, FONTS} from "../constants.js"

const { width, height } = Dimensions.get("window");

const FloatingButton = () => {
  const navigation = useNavigation();
  const animation = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState(false);
  const rotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
        }),
      },
    ],
  };
  const toggleMenu = () => {
    const toValue = open ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();

    setOpen(!open);
  };
  const getAnimatedStyle = (translateY) => ({
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, translateY],
        }),
      },
    ],
  });
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.bottomContainer}>
          <TouchableOpacity>
            <Animated.View
              style={[styles.button, styles.secondary, getAnimatedStyle(-80)]}
            >
              <MaterialCommunityIcons name="magnify" size={24} color="white" />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("LogActivity")}>
            <Animated.View
              style={[styles.button, styles.secondary, getAnimatedStyle(-140)]}
            >
              <MaterialCommunityIcons name="pen-plus" size={24} color="white" />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMenu}>
            <Animated.View style={[styles.button, styles.menu, rotation]}>
              <MaterialCommunityIcons
                name="plus-thick"
                size={24}
                color="white"
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "center",
    bottom: 84,
    right: width - 340,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomContainer: {
    flexDirection: "column",
  },
  button: {
    position: "absolute",
    height: 56,
    width: 56,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#80BD6B",
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  menu: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    height: 48,
    width: 48,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
});

export default FloatingButton;