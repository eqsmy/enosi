import { Image, View, TextInput, Text, Button } from "react-native";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { BasicButton } from "../components/Buttons";

export default function Login({ setLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    setLoggedIn(true);
  }

  return (
    <View style={loginStyles.container}>
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
        style={loginStyles.input}
        placeholder={"Email address"}
        value={email}
        onChangeText={setEmail}
      ></TextInput>
      <TextInput
        style={loginStyles.input}
        placeholder={"Password"}
        value={password}
        onChangeText={setPassword}
      ></TextInput>
      <BasicButton onPress={login}></BasicButton>
    </View>
  );
}

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    width: "70%",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
});
