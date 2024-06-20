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
  View,
  Button,
} from "react-native";
import { supabase } from "../utils/Supabase.js";
import { useNavigation } from "@react-navigation/native";
import { enosiStyles } from "./styles";
import { useUser } from "../utils/UserContext";
import { COLORS, FONTS } from "../constants.js";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(""); // Added state for first name
  const [lastName, setLastName] = useState("");
  const [isLogin, setIsLogin] = useState(true); //have to use this logic for this page only
  const [loading, setLoading] = useState(false);
  const { dispatch } = useUser();
  const navigation = useNavigation();

  // avatar upload
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(
    "https://usnnwgiufohluhxdtvys.supabase.co/storage/v1/object/public/avatars/default_profile.png?t=2023-12-07T18%3A39%3A27.039Z"
  );

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
                avatar_url:
                  avatarUrl ||
                  "https://usnnwgiufohluhxdtvys.supabase.co/storage/v1/object/public/avatars/default_profile.png?t=2023-12-07T18%3A39%3A27.039Z",
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

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User canceled image picker.");
        return;
      }

      const image = result.assets[0];
      console.log("Got image", image);

      if (!image.uri) {
        throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
      }

      const resizedPhoto = await ImageManipulator.manipulateAsync(
        image.uri,
        [{ resize: { width: 300, height: 300 } }], // resize to width of 300 and preserve aspect ratio
        { compress: 0.7, format: "jpeg" }
      );

      const arraybuffer = await fetch(resizedPhoto.uri).then((res) =>
        res.arrayBuffer()
      );

      const fileExt =
        resizedPhoto.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          contentType: resizedPhoto.mimeType ?? "image/jpeg",
        });

      if (uploadError) {
        // throw uploadError;
        console.log("Error uploading file: ", uploadError);
      }

      // onUpload(data.path);
      const url = `https://usnnwgiufohluhxdtvys.supabase.co/storage/v1/object/public/avatars/${data.path}`;
      setAvatarUrl(url);
      console.log("Uploaded", data);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

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
          {/* set up a flex stlye with the profile on the left and the button on the right vertically aligned */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              margin: 10,
            }}
          >
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                accessibilityLabel="Avatar"
                style={[styles.avatar]}
              />
            ) : (
              <View style={[styles.avatar]} />
            )}
            <View>
              <Button
                title={uploading ? "Uploading ..." : "Upload Profile Photo"}
                onPress={uploadAvatar}
                disabled={uploading}
              />
            </View>
          </View>
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
      <TouchableOpacity onPress={toggleLoginSignup} disabled={uploading}>
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
  avatar: {
    borderRadius: 100,
    overflow: "hidden",
    height: 75,
    width: 75,
  },
  noImage: {
    backgroundColor: "#333",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgb(200, 200, 200)",
    borderRadius: 5,
  },
});
