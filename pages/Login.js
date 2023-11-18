import React, { useState } from "react";
import {
  Image,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../utils/Supabase";
import { BasicButton } from "../components/Buttons";
import { useNavigation } from "@react-navigation/native";
import { enosiStyles } from "./styles";

export default function Login({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigation = useNavigation();

  //a function to allow the user to sign in with their email and password
  async function signInWithEmail() {
    console.log("sign in with email attempt");
    try {
      setLoading(true);
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      console.log("Sign in response: ", { user, error });
      if (user) setLoggedIn(true) && navigation.navigate("Home");
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  //a function to allow the user to sign up with their email and password
  async function signUpWithEmail() {
    try {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({ email, password });

      if (error) throw error;
      if (user) {
        Alert.alert("Check your email for the confirmation link.");
        setLoggedIn(true) && navigation.navigate("Home"); // Set loggedIn to true on successful sign-up
      }
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  //a variable to toggle between sign in and sign up
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
        source={require("../assets/logo.png")}
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
      {isLogin ? (
        <BasicButton
          text="Sign In"
          onPress={() => signInWithEmail()}
          loading={loading}
        />
      ) : (
        <BasicButton
          text="Sign Up"
          onPress={() => signUpWithEmail()}
          loading={loading}
        />
      )}
      <TouchableOpacity onPress={toggleLoginSignup}>
        <Text>
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
