import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useChallengeStore } from "../stores/stores";
import { COLORS, FONTS } from "../constants";
import Toast from "react-native-toast-message";
import { decode } from "base64-arraybuffer";
import { supabase } from "../utils/Supabase";
import StandardTextInput from "../components/TextInput";
import StandardPhotoPicker from "../components/PhotoPicker";
import { useUser } from "../utils/UserContext";

const Stack = createStackNavigator();

export function NewChallenges() {
  const navigation = useNavigation();
  const { state } = useUser();
  const userId = state.session.user.id;
  const insertChallenge = useChallengeStore((state) => state.insertChallenge);

  const [challengeName, setChallengeName] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [challengeGoal, setChallengeGoal] = useState("");
  const [challengeUnit, setChallengeUnit] = useState("");
  const [challengeDuration, setChallengeDuration] = useState("");
  const [headerImage, setHeaderImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  // Function to pick image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setHeaderImage(imageUri);
    }
  };

  const uploadImage = async (imageUri) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      try {
        reader.onload = async () => {
          const base64 = reader.result.split(",")[1];
          const decodedData = decode(base64);
          const fileName = `challenge_photos/${new Date().getTime()}.jpg`;

          const resp = await supabase.storage
            .from("challenge_photos")
            .upload(fileName, decodedData, {
              contentType: "image/jpeg",
            })
            .catch((error) => {
              reject(error.message);
            });
          // Construct and return the public URL for the uploaded file
          const publicUrl = `https://usnnwgiufohluhxdtvys.supabase.co/storage/v1/object/public/challenge_photos/${resp.data.path}`;
          resolve(publicUrl);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        reject(error.message);
      }
    });
  };

  const validateChallengeData = () => {
    // Ensure that required fields are not empty
    if (!challengeName.trim()) {
      Toast.show({
        type: "error",
        text1: "Challenge name is required.",
      });
      return false;
    }
    if (!challengeDescription.trim()) {
      Toast.show({
        type: "error",
        text1: "Challenge description is required.",
      });
      return false;
    }
    if (
      !challengeGoal.trim() ||
      isNaN(challengeGoal) ||
      parseFloat(challengeGoal) <= 0
    ) {
      Toast.show({
        type: "error",
        text1: "Challenge goal must be a positive number.",
      });
      return false;
    }
    if (!challengeUnit.trim()) {
      Toast.show({
        type: "error",
        text1: "Unit is required.",
      });
      return false;
    }
    if (
      !challengeDuration.trim() ||
      isNaN(challengeDuration) ||
      parseInt(challengeDuration, 10) <= 0
    ) {
      Toast.show({
        type: "error",
        text1: "Duration must be a positive number of days.",
      });
      return false;
    }
    // If all checks pass, return true
    return true;
  };

  async function createChallenge() {
    if (!validateChallengeData()) {
      // Validation failed; exit early
      return;
    }
    const uploadedImageUrl = headerImage
      ? await uploadImage(headerImage)
      : null;
    try {
      await insertChallenge(
        supabase,
        userId,
        challengeName,
        challengeDescription,
        parseFloat(challengeGoal),
        challengeUnit,
        parseFloat(challengeDuration, 10),
        uploadedImageUrl
      );
      Toast.show({
        type: "success",
        text1: "Challenge created successfully!",
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "There was an error. Challenge not created.",
        text2: error?.message || "An unexpected error occurred.",
      });
    }
  }
  return (
    <ScrollView
      style={styles.container}
      contentContainer={styles.contentContainer}
    >
      <View style={styles.inputGroup}>
        <StandardTextInput
          labelText="Challenge Name"
          placeholder="Enter challenge name"
          value={challengeName}
          onChangeText={setChallengeName}
        />
        <StandardTextInput
          labelText="Challenge Description"
          placeholder="Tell us about the challenge"
          value={challengeDescription}
          onChangeText={setChallengeDescription}
          height={90}
        />
        <StandardTextInput
          labelText="Goal amount"
          placeholder="Give a numeric number for the total amount"
          value={challengeGoal}
          onChangeText={setChallengeGoal}
          keyboardType="numeric"
        />
        <StandardTextInput
          labelText="Unit Type"
          placeholder="Unit (miles, hours, etc.)"
          value={challengeUnit}
          onChangeText={setChallengeUnit}
        />
        <StandardTextInput
          labelText="Duration"
          placeholder="How long will the challenge last (in days)."
          value={challengeDuration}
          onChangeText={setChallengeDuration}
          keyboardType="numeric"
        />
      </View>
      <StandardPhotoPicker
        photoUri={headerImage}
        pickImage={() => pickImage(false)}
        labelText="Select Header Photo"
        iconName="picture-o"
        iconSize={30}
        iconFamily="font-awesome"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={createChallenge}>
          <Text style={styles.submitButtonText}>Create Challenge</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 40,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    fontFamily: FONTS.bold,
    color: "white",
    fontSize: 18,
  },
});

export default function NewChallengesFlow({}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="NewChallenges"
        options={{
          title: "New Challenge",
        }}
        children={(props) => <NewChallenges props={props} />}
      />
    </Stack.Navigator>
  );
}
