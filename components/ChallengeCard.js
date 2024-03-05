import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { COLORS, FONTS } from "../constants"; // Ensure this path is correct
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { insertChallenge } from "@stores/api";
import { supabase } from "../utils/Supabase";
import { useUser } from "../utils/UserContext";

export const ChallengeCard = ({ challenge, communityId, alreadyJoined }) => {
  const { state } = useUser();
  const navigation = useNavigation();

  console.log("this current cards challenge", challenge);

  handleJoinChallenge = async (supabase, communityId, challenge) => {
    console.log("Joining challenge", challenge);

    const { data, error } = await insertChallenge(
      supabase,
      communityId,
      challenge
    );

    if (error) {
      console.log("Error joining challenge");
    }
    if (data) {
      console.log("Challenge joined");
      navigation.pop();
    }
  };

  return (
    <Pressable style={styles.cardContainer}>
      <Image source={{ uri: challenge.header_image }} style={styles.photo} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{challenge.name}</Text>
        <Text style={styles.description}>{challenge.description}</Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
        ></View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon
            name="flag"
            size={20}
            style={{ marginRight: 5 }}
            color={COLORS.primary}
          />
          <Text style={styles.members}>
            {challenge.goal} {challenge.unit}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={alreadyJoined ? styles.acceptedButton : styles.joinButton}
        onPress={() => {
          handleJoinChallenge(supabase, communityId, challenge);
        }}
      >
        <Text
          style={
            alreadyJoined ? styles.acceptedButtonText : styles.joinButtonText
          }
        >
          {!alreadyJoined ? "Accept" : "Accepted"}
        </Text>
      </TouchableOpacity>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginBottom: 10,
    alignItems: "flex-start",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: FONTS.primary,
    marginBottom: 4,
  },
  members: {
    fontSize: 14,
    color: COLORS.secondary,
    fontFamily: FONTS.secondary,
    marginBottom: 2,
    color: COLORS.primary,
  },
  location: {
    fontSize: 14,
    color: COLORS.accent,
    fontFamily: FONTS.tertiary,
    marginBottom: 2,
  },
  about: {
    fontSize: 14,
    color: COLORS.text,
    fontFamily: FONTS.secondary,
    marginTop: 4,
  },
  joinButton: {
    marginLeft: "auto",
    backgroundColor: "blue",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: "flex-start",
  },
  joinButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  acceptedButton: {
    marginLeft: "auto",
    backgroundColor: "white",
    borderRadius: 15,
    borderColor: "blue",
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: "flex-start",
  },
  acceptedButtonText: {
    color: "blue",
    fontWeight: "bold",
  },
});
