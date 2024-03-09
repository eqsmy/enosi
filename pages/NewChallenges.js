import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Image,
  Platform,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useChallengeStore } from "../stores/stores";
import { COLORS, FONTS } from "../constants";
import Toast from "react-native-toast-message";
import { decode } from "base64-arraybuffer";
import { supabase } from "../utils/Supabase";

const NewChallenges = () => {
  const navigation = useNavigation();
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
    }
  };

  const backButtonHandler = () => {
    navigation.goBack();
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
          const fileName = `challenges_/${new Date().getTime()}.jpg`;

          const resp = await supabase.storage
            .from("challenge_photos")
            .upload(fileName, decodedData, {
              contentType: "image/jepg",
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

  const createChallenge = async () => {
    const uploadedImageUrl = headerImage
      ? await uploadImage(headerImage)
      : null;
    await insertChallenge(
      supabase,
      challengeName,
      challengeDescription,
      challengeGoal,
      challengeUnit,
      challengeDuration,
      uploadedImageUrl
    );
    Toast.show({
      type: "success",
      text1: "Challenge created successfully!",
    });
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder="Challenge Name"
          value={challengeName}
          onChangeText={setChallengeName}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Challenge Description"
          value={challengeDescription}
          onChangeText={setChallengeDescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Goal Total"
          value={challengeGoal}
          onChangeText={setChallengeGoal}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Unit (miles, hours, etc.)"
          value={challengeUnit}
          onChangeText={setChallengeUnit}
        />
        <TextInput
          style={styles.input}
          placeholder="Duration (in days)"
          value={challengeDuration}
          onChangeText={setChallengeDuration}
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
        <Text style={styles.photoPickerText}>Select Challenge Image</Text>
        {headerImage && (
          <Image source={{ uri: headerImage }} style={styles.imagePreview} />
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={createChallenge}>
        <Text style={styles.submitButtonText}>Create Challenge</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  backButton: {
    margin: 10,
    alignSelf: "flex-start",
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: COLORS.lightgrey,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  textArea: {
    height: 100,
  },
  photoPicker: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
  },
  photoPickerText: {
    fontFamily: FONTS.bold,
    color: "white",
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    fontFamily: FONTS.bold,
    color: "white",
  },
});

export default NewChallenges;
