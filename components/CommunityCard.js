import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants"; // Ensure this path is correct

const CommunityCard = ({
  community_name,
  community_description,
  location,
  member_count,
  profile_photo_url,
}) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: profile_photo_url }} style={styles.photo} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{community_name}</Text>
        <Text style={styles.description}>{community_description}</Text>
        <Text style={styles.members}>{`${member_count}  members`}</Text>
        <Text style={styles.location}>{location}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    height: 170,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: COLORS.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
    alignItems: "flex-start",
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
    color: COLORS.primary,
    fontFamily: FONTS.primary,
    marginBottom: 4,
  },
  members: {
    fontSize: 14,
    color: COLORS.secondary,
    fontFamily: FONTS.secondary,
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: COLORS.tertiary,
    fontFamily: FONTS.tertiary,
    marginBottom: 2,
  },
  about: {
    fontSize: 14,
    color: COLORS.text,
    fontFamily: FONTS.secondary,
    marginTop: 4,
  },
});

export default CommunityCard;
