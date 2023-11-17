import {
  Image,
  View,
  TextInput,
  Text,
  Button,
  SafeAreaView,
} from "react-native";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { BasicButton } from "../components/Buttons";
import { enosiStyles } from "./styles";

export default function Login({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    setLoggedIn(true);
  }

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
        value={email}
        onChangeText={setEmail}
      ></TextInput>
      <TextInput
        style={enosiStyles.textInput}
        placeholder={"Password"}
        value={password}
        onChangeText={setPassword}
      ></TextInput>
      <BasicButton onPress={login}></BasicButton>
    </SafeAreaView>
  );
}
