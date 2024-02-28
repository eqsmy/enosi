import React, { useEffect, useState, useRef } from "react";
import { UserProvider, useUser } from "./utils/UserContext";
import { Text, TouchableWithoutFeedback, View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "react-native-elements";
import { FAB } from "@rneui/themed";

//import all the pages we have
import Home from "./pages/Home";
import Search from "./pages/Search";
import { ChallengesStack } from "./pages/Challenges2";
import Profile from "./pages/Profile";
import LogActivity from "./pages/LogActivity";
import Login from "./pages/Login";
import NewCommunityFlow from "./pages/NewCommunities";
import MyCommunities from "./pages/MyCommunities";

//other imports we need
import { LogoHeader } from "./components/Headers";
import { setCustomText } from "react-native-global-props";
import { supabase } from "./utils/Supabase";
import * as Font from "expo-font";
import {
  COLORS,
  FONT_SOURCE_HEADER,
  FONT_SOURCE_BODY,
  FONT_SOURCE_MEDIUM,
  FONT_SOURCE_BOLD,
} from "./constants";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Theme = {
  ...DefaultTheme,
  colors: {
    primary: COLORS.primary,
    background: COLORS.lightprimary,
    card: "#ffffff",
    text: COLORS.defaultgray,
    border: "#8B9C85",
    notification: "#8B9C85",
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
          headerStyle: { height: 120, borderWidth: 0 },
          tabBarStyle: { visibility: "hidden" },
          headerShadowVisible: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        children={Search}
        options={{
          tabBarLabel: "Search",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
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
      /> */}
      <Tab.Screen
        name="My Communities"
        component={MyCommunities}
        options={{
          headerShadowVisible: false,
          headerTitle: "My Communities",
          tabBarIcon: ({ color, size }) => (
            <Icon name="tree" type="entypo" color={color} size={size} />
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
          <Stack.Screen
            name="NewCommunityFlow"
            options={{
              headerShown: false,
            }}
            component={NewCommunityFlow}
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
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          "OdorMeanChey-Regular": FONT_SOURCE_HEADER,
          "Inter-Regular": FONT_SOURCE_BODY,
          "Inter-Medium": FONT_SOURCE_MEDIUM,
          "Inter-Bold": FONT_SOURCE_BOLD,
        });
        setCustomText({ style: { fontFamily: "Inter-Regular" } });
        setFontsLoaded(true);
      } catch (error) {
        console.log("Error loading fonts", error);
      }
    }

    loadFonts();
  }, []);

  return fontsLoaded ? (
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
  ) : (
    // Return null or some loading indicator while fonts are loading
    <View style={styles.loadingContainer}>
      <Text>Loading...</Text>
    </View>
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
