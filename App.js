import React, { useEffect } from "react";
import { UserProvider, useUser } from "./utils/UserContext";
import { supabase } from "./utils/Supabase";
import { TouchableWithoutFeedback } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "./pages/Home";
import Communities from "./pages/Communities";
import Challenges from "./pages/Challenges";
import Profile from "./pages/Profile";
import LogActivity from "./pages/LogActivity";
import Login from "./pages/Login";

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

const AppContent = () => {
  //use 'useUser' custom hook directly
  const { state } = useUser();

  useEffect(() => {
    console.log("Logged In State Changed:", state.loggedIn);
    // You can add any logic here that should run when loggedIn state changes
  }, [state.loggedIn]);

  return (
    <NavigationContainer theme={Theme}>
      {/* the state of the app is managed globally via Context /  */}
      {state.loggedIn ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              headerTitle: (props) => <LogoHeader {...props} />,
              tabBarStyle: { visibility: "hidden" },
              headerShadowVisible: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Communities"
            component={Communities}
            options={{
              headerShadowVisible: false,
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
              headerShadowVisible: false,
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
              headerShadowVisible: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="map" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            options={{
              headerShadowVisible: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <Login />
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
