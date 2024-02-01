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
import Communities from "./pages/Communities";
import { ChallengesStack } from "./pages/Challenges";
import Profile from "./pages/Profile";
import LogActivity from "./pages/LogActivity";
import Login from "./pages/Login";

//other imports we need
import { LogoHeader } from "./components/Headers";
import { setCustomText } from "react-native-global-props";
import { supabase } from "./utils/Supabase";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const customTextProps = {
  style: {
    fontFamily: "Avenir",
  },
};
setCustomText(customTextProps);

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#61B8C2",
  },
};

function Tabs() { 
  const [addFriendOrCommModal, setAddFriendOrCommModal] = useState(false);
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
        children={() => (
          <Communities
            addFriendOrCommModal={addFriendOrCommModal}
            setAddFriendOrCommModal={setAddFriendOrCommModal}
          ></Communities>
        )}
        options={{
          tabBarLabel: "Communities",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
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
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="LogActivity" component={LogActivity} options={{ headerShown: false }} />
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

const AppContent = () => {
  const navigationRef = useRef();
  return (
    <NavigationContainer theme={Theme} ref={navigationRef}>
    <RootStack />
      <FAB
        placement="right"
        color="black"
        icon={{ name: "add", color: "white" }}
        size="small"
        onPress={() => navigationRef.current?.navigate("LogActivity")}
        style={{ position: "absolute", margin: 16, right: 10, bottom: 70 }}
      />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  fabStyle: {
    position: 'absolute',
    margin: 16,
    right: 10,
    bottom: 50,
  },
})

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
