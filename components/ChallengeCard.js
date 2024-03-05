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

export const ChallengeCard = ({
  name,
  description,
  goal,
  unit,
  header_image,
  alreadyJoined,
}) => {
  const navigation = useNavigation();
  return (
    <Pressable style={styles.cardContainer}>
      <Image source={{ uri: header_image }} style={styles.photo} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
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
            {goal} {unit}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={alreadyJoined ? styles.acceptedButton : styles.joinButton}
        onPress={() => {
          //toggleJoin(supabase, state.session.user.id, communityId);
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
