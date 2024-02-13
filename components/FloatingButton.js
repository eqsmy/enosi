import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  SafeAreaView,
  Text,
} from "react-native";
import React, { useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTS } from "../constants.js";
import { Icon } from "react-native-elements";
import { trackEvent } from "../utils/Analytics.js";

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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("NewCommunityFlow");
              trackEvent("navigate", { to: "new community flow" });
            }}
          >
            <Animated.View
              style={[styles.button, styles.secondary, getAnimatedStyle(-70)]}
            >
              <Icon type="material" name="group-add" color="white"></Icon>
              <Text style={{ color: "white", marginLeft: 5 }}>
                Create community
              </Text>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("LogActivity");
              trackEvent("navigate", { to: "log activity flow" });
            }}
          >
            <Animated.View
              style={[styles.button, styles.secondary, getAnimatedStyle(-130)]}
            >
              <Icon type="material" name="add-box" color="white"></Icon>
              <Text style={{ color: "white", marginLeft: 5 }}>
                Log activity
              </Text>
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
    bottom: 70,
    right: 70,
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
    padding: 10,
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
    borderRadius: 30,
    paddingLeft: 10,
    width: "auto",
    paddingRight: 10,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    right: -56,
  },
});

export default FloatingButton;
