import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "./pages/Home";
import Communities from "./pages/Communities";
import Challenges from "./pages/Challenges";
import Profile from "./pages/Profile";
import LogActivity from "./pages/LogActivity";

import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Path } from "react-native-svg";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { LogoHeader } from "./components/Headers";

const Tab = createBottomTabNavigator();

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#61B8C2",
  },
};

export default function App() {
  return (
    <NavigationContainer theme={Theme}>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerTitle: (props) => <LogoHeader {...props} />,
            tabBarStyle: { visibility: "hidden" },
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Communities"
          component={Communities}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="LogActivity"
          component={LogActivity}
          options={{
            title: "Log Activity",
            tabBarButton: (props) => (
              <TouchableWithoutFeedback {...props}>
                <Svg
                  width="20%"
                  height="100%"
                  viewBox="0 0 50 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <Circle cx="24.5" cy="24.5" r="20" fill="#61B8C2" />
                  <Path
                    d="M24 15V35"
                    stroke="white"
                    stroke-width="10"
                    stroke-linecap="square"
                  />
                  <Path
                    d="M14 25H34"
                    stroke="white"
                    stroke-width="10"
                    stroke-linecap="square"
                  />
                </Svg>
              </TouchableWithoutFeedback>
            ),
          }}
        />

        <Tab.Screen
          name="Challenges"
          component={Challenges}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
