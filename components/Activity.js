import { Image, StyleSheet, Text, View } from "react-native";
import {COLORS, FONTS} from "../constants.js";

export default function Activity({ item, showUser = false }) {
  return (
    <View style={styles.activityCard}>
      {showUser ? (
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.profiles.avatar_url }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>
            {item.profiles.first_name} {item.profiles.last_name}
          </Text>
        </View>
      ) : null}
      <Image source={{ uri: item.photo_url }} style={styles.activityImage} />
      <Text style={styles.activityCaption}>{item.caption}</Text>
      <Text style={styles.activityDetails}>
        Type: {item.activity_type} - Duration: {item.duration} mins - Distance:{" "}
        {item.distance} mi
      </Text>
      <Text style={styles.activityTimestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentArea: {
    paddingHorizontal: 10,
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    fontFamily: FONTS.bold,
    fontSize: 19,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
    fontFamily: FONTS.bold,
    fontSize: 19,
  },
  activityImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  activityCaption: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    fontFamily: FONTS.bold,
  },
  activityDetails: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
    fontFamily: FONTS.body,
  },
  activityTimestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
    fontFamily: FONTS.body,
  },
});
