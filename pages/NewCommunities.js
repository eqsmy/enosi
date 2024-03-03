import {
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { BasicButton } from "../components/Buttons";
import { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../utils/UserContext";
import { supabase } from "../utils/Supabase";
import _ from "lodash";
import { createStackNavigator } from "@react-navigation/stack";
import { COLORS, FONTS } from "../constants";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import Toast from "react-native-root-toast";

const Stack = createStackNavigator();

export function NewCommunities() {
  const navigation = useNavigation();
  const [communityName, setCommunityName] = useState("");
  const [communityDetails, setCommunityDetails] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [headerPhoto, setHeaderPhoto] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [communityLocation, setCommunityLocation] = useState(null);

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
  const pickImage = async (isProfile) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      if (isProfile) {
        setProfilePhoto(imageUri);
      } else {
        setHeaderPhoto(imageUri);
      }
    }
  };

  const uploadImage = async (imageUri, folder) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      try {
        reader.onload = async () => {
          const base64 = reader.result.split(",")[1];
          const decodedData = decode(base64);
          const fileName = `community_/${new Date().getTime()}.jpg`;

          const resp = await supabase.storage
            .from("community_photos")
            .upload(fileName, decodedData, {
              contentType: "image/jepg",
            })
            .catch((error) => {
              reject(error.message);
            });
          // Construct and return the public URL for the uploaded file
          const publicUrl = `https://usnnwgiufohluhxdtvys.supabase.co/storage/v1/object/public/community_photos/${resp.data.path}`;
          resolve(publicUrl);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        reject(error.message);
      }
    });
  };

  async function createCommunity() {
    // Upload profile and header photos
    const uploadProfilePhoto = profilePhoto
      ? uploadImage(profilePhoto, "profile_photos")
      : Promise.resolve(null);
    const uploadHeaderPhoto = headerPhoto
      ? uploadImage(headerPhoto, "header_photos")
      : Promise.resolve(null);

    try {
      // Upload images in parallel
      const [profilePhotoUrl, headerPhotoUrl] = await Promise.all([
        uploadProfilePhoto,
        uploadHeaderPhoto,
      ]);
      const communityData = {
        name: communityName,
        public: isPublic,
        location: communityLocation,
        description: communityDetails,
        header_photo_url: headerPhotoUrl,
        profile_photo_url: profilePhotoUrl,
      };
      const { error } = await supabase
        .from("communities")
        .insert([communityData]);
      if (error) throw error;
      // Reset state or navigate as necessary
      Toast.show({
        type: "success",
        text1: "Community created successfully!",
      });
      navigation.navigate("Communities");
    } catch (error) {
      console.error("Error creating community:", error.message);
      alert("Error", "Failed to create community.");
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Community Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter community name"
          value={communityName}
          onChangeText={setCommunityName}
        ></TextInput>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location</Text>
        <View style={styles.iconInput}>
          <MaterialIcons
            name="location-on"
            size={24}
            color={COLORS.secondary}
          />
          <TextInput
            style={styles.inputWithIcon}
            value={communityLocation}
            onChangeText={setCommunityLocation}
            placeholder="Community location"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={communityDetails}
          onChangeText={setCommunityDetails}
          placeholder="What's your community about?"
          multiline
        />
      </View>

      <View style={styles.photoPickerGroup}>
        <TouchableOpacity
          style={styles.photoPicker}
          onPress={() => pickImage(true)}
        >
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.imagePreview} />
          ) : (
            <>
              <FontAwesome
                name="user-circle-o"
                size={24}
                color={COLORS.lightgrey}
              />
              <Text style={styles.photoPickerText}>Select Profile Photo</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.photoPicker}
          onPress={() => pickImage(false)}
        >
          {headerPhoto ? (
            <Image source={{ uri: headerPhoto }} style={styles.imagePreview} />
          ) : (
            <>
              <FontAwesome
                name="picture-o"
                size={24}
                color={COLORS.lightgrey}
              />
              <Text style={styles.photoPickerText}>Select Header Photo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.toggleGroup}>
        <Text style={styles.label}>
          {isPublic ? "Public Community" : "Private Community"}
        </Text>
        <Switch
          trackColor={{ false: COLORS.lightgrey, true: COLORS.primary }}
          thumbColor={isPublic ? COLORS.white : COLORS.secondary}
          ios_backgroundColor={COLORS.defaultgray}
          onValueChange={setIsPublic}
          value={isPublic}
        />
      </View>
      <View style={{ width: "35%", alignItems: "center" }}>
        <TouchableOpacity onPress={createCommunity} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
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
    marginBottom: 30,
  },
  label: {
    marginBottom: 5,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    fontSize: 16,
  },
  input: {
    backgroundColor: COLORS.lightgrey,
    borderRadius: 10,
    fontFamily: FONTS.medium,
    padding: 15,
    fontSize: 14,
    marginBottom: 10,
  },
  inputWithIcon: {
    flex: 1,
    fontFamily: FONTS.medium,
    padding: 5,
    marginLeft: 5,
  },
  textArea: {
    paddingTop: 15,
    height: 120,
  },
  iconInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightgrey,
    borderRadius: 5,
    padding: 10,
  },
  photoPickerGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },
  photoPicker: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    height: 150,
  },
  photoPickerText: {
    fontFamily: FONTS.bold,
    color: COLORS.darkgray,
    marginTop: 5,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginTop: 10,
  },
  toggleGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
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

export default function NewCommunityFlow({}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="NewCommunities"
        options={{
          title: "New Community",
        }}
        children={(props) => <NewCommunities props={props} />}
      />
      {/* <Stack.Screen
        name="NewCommunityPrivacySettings"
        options={{
          title: "Community Settings",
        }}
        component={PrivacySettings}
      /> */}
    </Stack.Navigator>
  );
}
