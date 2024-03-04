import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { COLORS, FONTS } from "../constants"; // Ensure this path is correct
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";

const CommunityCard = ({
  community_name,
  community_description,
  location,
  member_count,
  profile_photo_url,
  community_id,
}) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate("CommunityDetail", {
          communityId: community_id,
        })
      }
    >
      <Image source={{ uri: profile_photo_url }} style={styles.photo} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{community_name}</Text>
        <Text style={styles.description}>{community_description}</Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
        >
          <Icon
            name="people"
            size={20}
            style={{ marginRight: 5 }}
            color={COLORS.primary}
          />
          <Text style={styles.members}>{member_count} members</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon
            name="location-on"
            size={20}
            style={{ marginRight: 5 }}
            color={COLORS.primary}
          />
          <Text style={styles.members}>{location}</Text>
        </View>
      </View>
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
});

export default CommunityCard;
