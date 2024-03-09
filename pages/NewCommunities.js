import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../utils/Supabase";
import _ from "lodash";
import { createStackNavigator } from "@react-navigation/stack";
import { COLORS, FONTS } from "../constants";
import * as ImagePicker from "expo-image-picker";
import { decode } from "base64-arraybuffer";
import StandardTextInput from "../components/TextInput";
import StandardPhotoPicker from "../components/PhotoPicker";
import { useUser } from "../utils/UserContext";
import { useCommunitiesStore } from "../stores/stores";
import Toast from "react-native-toast-message";

const Stack = createStackNavigator();

export function NewCommunities() {
  const navigation = useNavigation();
  const { state } = useUser();
  const userId = state.session.user.id;
  const { insertCommunity } = useCommunitiesStore((state) => ({
    insertCommunity: state.insertCommunity,
  }));
  // collect all the community data
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

  const uploadImage = async (imageUri) => {
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

      const communityId = await insertCommunity(
        supabase,
        userId,
        communityName,
        isPublic,
        communityLocation,
        communityDetails,
        headerPhotoUrl,
        profilePhotoUrl
      );
      if (communityId) {
        Toast.show({
          type: "success",
          text1: "Community Created!",
          position: "top",
        });
        navigation.navigate("My Communities");
        navigation.push("CommunityDetail", { communityId });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "There was an error. Community not created.",
        position: "top",
      });
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.inputGroup}>
        <StandardTextInput
          labelText="Community Name"
          placeholder="Enter community name"
          value={communityName}
          onChangeText={setCommunityName}
        />
        <StandardTextInput
          labelText="Location"
          placeholder="Community location"
          value={communityLocation}
          onChangeText={setCommunityLocation}
          spaceAbove={10}
          icon={"location-on"}
        />
        <StandardTextInput
          labelText="Description"
          placeholder="What's your community about?"
          value={communityDetails}
          onChangeText={setCommunityDetails}
          spaceAbove={10}
          height={120}
        />
      </View>

      <View style={styles.photoPickerGroup}>
        <StandardPhotoPicker
          photoUri={profilePhoto}
          pickImage={() => pickImage(true)}
          labelText="Select Profile Photo"
          iconName="user-circle-o"
          iconSize={30}
          iconFamily="font-awesome"
        />
        <StandardPhotoPicker
          photoUri={headerPhoto}
          pickImage={() => pickImage(false)}
          labelText="Select Header Photo"
          iconName="picture-o"
          iconSize={30}
          iconFamily="font-awesome"
        />
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
  photoPickerGroup: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
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
