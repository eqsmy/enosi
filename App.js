import React, { useEffect, useState, useRef } from "react";
import { UserProvider, useUser } from "./utils/UserContext";
import { TouchableWithoutFeedback, View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FAB } from "@rneui/themed";

//import all the pages we have
import Home from "./pages/Home";
import Search from "./pages/Search";
import { ChallengesStack } from "./pages/Challenges";
import Profile from "./pages/Profile";
import LogActivity from "./pages/LogActivity";
import Login from "./pages/Login";

//other imports we need
import { LogoHeader } from "./components/Headers";
import { setCustomText } from "react-native-global-props";
import { supabase } from "./utils/Supabase";
import * as Font from 'expo-font';
import {
  COLORS,
  FONTS,
  FONT_SOURCE_HEADER,
  FONT_SOURCE_BODY,
  FONT_SOURCE_MEDIUM,
  FONT_SOURCE_BOLD,
} from './constants';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const loadFonts = async () => {
  await Font.loadAsync({
    [FONTS.header]: FONT_SOURCE_HEADER,
    [FONTS.body]: FONT_SOURCE_BODY,
    [FONTS.medium]: FONT_SOURCE_MEDIUM,
    [FONTS.bold]: FONT_SOURCE_BOLD,
  });
};


const customTextProps = {
  style: {
    fontFamily: FONTS.body,
  },
};
setCustomText(customTextProps);

const Theme = {
  ...DefaultTheme,
  colors: {
    primary: COLORS.primary,
    background: COLORS.lightprimary,
    card: '#ffffff',
    text: COLORS.defaultgray,
    border: '#8B9C85',
    notification: '#8B9C85',
  },
};

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: (props) => (
            <View
              style={{
                paddingBottom: 40,
              }}
            >
              <LogoHeader {...props} />
            </View>
          ),
          headerStyle: { height: 120, borderWidth: 1 },
          tabBarStyle: { visibility: "hidden" },
          headerShadowVisible: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CommunitiesTab"
        children={Search}
        options={{
          tabBarLabel: "Search",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ChallengesStack"
        component={ChallengesStack}
        options={{
          headerShadowVisible: false,
          headerShown: false,
          tabBarLabel: "Challenges",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShadowVisible: false,
          headerTitle: "",
          headerRight: () => (
            <TouchableWithoutFeedback>
              <Ionicons
                onPress={() => {
                  handleLogout();
                }}
                name="settings"
                size={35}
                style={{ right: 10 }}
              />
            </TouchableWithoutFeedback>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function RootStack() {
  const { state, dispatch } = useUser();
  useEffect(() => {
    console.log("Logged In State Changed:", state.loggedIn);
    loadFonts();
  }, [state.loggedIn]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      dispatch({ type: "SET_SESSION", payload: null });
    } else {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Stack.Navigator>
      {state.loggedIn ? (
        <>
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LogActivity"
            component={LogActivity}
            options={{
              headerShown: true,
              headerShadowVisible: false,
              headerTitle: "Log Activity",
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

const AppContent = () => {
  const navigationRef = useRef();
  return (
    <NavigationContainer theme={Theme} ref={navigationRef}>
      <RootStack />
      {/* <FAB
        placement="right"
        color="black"
        icon={{ name: "add", color: "white" }}
        size="small"
        onPress={() => navigationRef.current?.navigate("LogActivity")}
        style={{ position: "absolute", margin: 16, right: 10, bottom: 70 }}
      /> */}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  fabStyle: {
    position: "absolute",
    margin: 16,
    right: 10,
    bottom: 50,
  },
});

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
