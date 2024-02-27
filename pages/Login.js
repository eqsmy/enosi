import React, { useState } from "react";
import {
  Image,
  TextInput,
  SafeAreaView,
  Alert,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { supabase } from "../utils/Supabase";
import { useNavigation } from "@react-navigation/native";
import { enosiStyles } from "./styles";
import { useUser } from "../utils/UserContext";
import {COLORS, FONTS} from "../constants.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(""); // Added state for first name
  const [lastName, setLastName] = useState("");
  const [isLogin, setIsLogin] = useState(true); //have to use this logic for this page only
  const [loading, setLoading] = useState(false);
  const { dispatch } = useUser();
  const navigation = useNavigation();

  const signIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      dispatch({ type: "SET_SESSION", payload: data });
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      await supabase.auth
        .signUp({
          email: email,
          password: password,
          options: {
            data: { first_name: firstName, last_name: lastName }, // Passing additional data
          },
        })
        .then(async (newUser) => {
          console.log(newUser.data.user.id);
          const { data: data2, error: error2 } = await supabase
            .from("profiles")
            .insert([
              {
                username: email,
                first_name: firstName,
                last_name: lastName,
                id: newUser.data.user.id,
              },
            ])
            .select();
          if (error2) throw error2;
          dispatch({ type: "SET_SESSION", payload: newUser.data });
        });

      navigation.navigate("Profile"); // Navigate to Profile page
    } catch (error) {
      console.error("Signup Error:", error);
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleLoginSignup = () => {
    setIsLogin(!isLogin);
  };

  return (
    <SafeAreaView style={enosiStyles.container}>
      <Image
        style={{
          margin: "auto",
          marginTop: 10,
          height: 50,
          width: "50%",
          paddingBottom: 80,
        }}
        source={require("../assets/logocray.png")}
        resizeMode="contain"
      />
      <TextInput
        style={enosiStyles.textInput}
        placeholder={"Email address"}
        onChangeText={setEmail}
        value={email}
        autoCapitalize={"none"}
      ></TextInput>
      <TextInput
        style={enosiStyles.textInput}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        placeholder={"Password"}
        autoCapitalize={"none"}
      ></TextInput>
      {!isLogin && (
        <>
          <TextInput
            style={enosiStyles.textInput}
            placeholder={"First Name"}
            onChangeText={setFirstName}
            value={firstName}
            autoCapitalize={"none"}
          />
          <TextInput
            style={enosiStyles.textInput}
            placeholder={"Last Name"}
            onChangeText={setLastName}
            value={lastName}
            autoCapitalize={"none"}
          />
        </>
      )}
      <Pressable
        style={styles.button}
        onPress={isLogin ? signIn : signUp}
        loading={loading}
      >
        <Text style={styles.login_signup}>
          {" "}
          {isLogin ? "Login" : "Sign Up"}
        </Text>
      </Pressable>
      <TouchableOpacity onPress={toggleLoginSignup}>
        <Text style={enosiStyles.text}>
          {isLogin ? "Sign Up" : "Login"} Instead
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    margin: 10,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: COLORS.primary,
  },
  login_signup: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    fontFamily: FONTS.bold,
  },
});
