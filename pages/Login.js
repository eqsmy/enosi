import React, { useState } from "react";
import {
  Image,
  TextInput,
  SafeAreaView,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../utils/supabase";
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

  const authenticateUser = async (action) => {
    setLoading(true);
    try {
      const response =
        action === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      const { data, error } = response;
      //console.log("Response:", { data, error });
      if (error) throw new Error(error.message);
      if (data) {
        dispatch({ type: "SET_SESSION", payload: data });
        navigation.navigate("Home");
      }
    } catch (error) {
      Alert.alert(
        action === "login" ? "Login Failed" : "Sign Up Failed",
        error.message
      );
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
      <BasicButton
        title={isLogin ? "Login" : "Sign Up"}
        onPress={() => authenticateUser(isLogin ? "login" : "signup")}
        loading={loading}
      />
      <TouchableOpacity onPress={toggleLoginSignup}>
        <Text style={enosiStyles.text}>
          {isLogin ? "Sign Up" : "Login"} Instead
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
