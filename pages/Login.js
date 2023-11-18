import React, { useState } from "react";
import {
  Image,
  TextInput,
  SafeAreaView,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../utils/Supabase";
import { BasicButton } from "../components/Buttons";
import { useNavigation } from "@react-navigation/native";
import { enosiStyles } from "./styles";
import { useUser } from "../utils/UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); //have to use this logic for this page only
  const [loading, setLoading] = useState(false);
  const { dispatch } = useUser();
  const navigation = useNavigation();

  //a function to allow the user to sign in with their email and password
  const signInWithEmail = async () => {
    setLoading(true);
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        Alert.alert("Login Failed", error.message);
        return;
      }
      if (user) {
        dispatch({ type: "SET_SESSION", payload: user });
        console.log("Dispatched SET_SESSION with user:", user);
        navigation.navigate("Home");
      }
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async () => {
    setLoading(true);
    try {
      const { user, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        Alert.alert("Sign Up Failed", error.message);
        return;
      }
      if (user) {
        Alert.alert("Success", "Check your email for the confirmation link.");
      }
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
          onPress={signInWithEmail}
          loading={loading}
        />
      ) : (
        <BasicButton
          text="Sign Up"
          onPress={signUpWithEmail}
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
