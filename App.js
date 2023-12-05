import React, { useEffect, useState } from "react";
import { UserProvider, useUser } from "./utils/UserContext";
import { TouchableWithoutFeedback, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { setCustomText } from "react-native-global-props";

import Home from "./pages/Home";
import Communities from "./pages/Communities";
import Challenges, { ChallengesStack } from "./pages/Challenges";
import Profile from "./pages/Profile";
import LogBook from "./pages/LogBook";
import { LogActivity1, LogActivity2 } from "./pages/LogActivity";
import Login from "./pages/Login";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Path } from "react-native-svg";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LogoHeader } from "./components/Headers";
import { supabase } from "./utils/Supabase";

const Tab = createBottomTabNavigator();

// This is not working right now but it would be cool if it did
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

const Stack = createStackNavigator();
function LogStack() {
  return (
    <Stack.Navigator screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen
        name="LogActivity1"
        options={{ headerShown: false }}
        component={LogActivity1}
      />
      <Stack.Screen
        name="LogActivity2"
        options={{ headerShown: false }}
        component={LogActivity2}
      />
    </Stack.Navigator>
  );
}

const AppContent = () => {
  //use 'useUser' custom hook directly
  const { state, dispatch } = useUser();
  const [addFriendOrCommModal, setAddFriendOrCommModal] = useState(false);

  useEffect(() => {
    console.log("Logged In State Changed:", state.loggedIn);
    // You can add any logic here that should run when loggedIn state changes
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
    <NavigationContainer theme={Theme}>
      {/* the state of the app is managed globally via Context /  */}
      <Tab.Navigator>
        {state.loggedIn ? (
          <>
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
              name="LogActivity"
              component={LogStack}
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
          </>
        ) : (
          <Tab.Screen
            name="Login"
            component={Login}
            options={{
              tabBarButton: () => null,
            }}
          />
        )}
      </Tab.Navigator>
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
