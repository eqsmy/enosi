import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";

export default function UserChallenges({ item, onPress, showUser }) {
  return (
    <View style={styles.challengeCard}>
      <View style={styles.challengeInfo}>
        <Image
          source={{ uri: item.challenges.photo_url }}
          style={styles.challengeImage}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.challengeTitle}>{item.challenges.name}</Text>
        <Text style={styles.challengeDetails}>
          Info: {item.challenges.description}
        </Text>
      </View>
      {item.progress < 100 ? (
        <CircularProgress
          radius={20}
          value={item.progress}
          inActiveStrokeColor={"#2ecc71"}
          inActiveStrokeOpacity={0.2}
          progressValueColor={"#fff"}
          valueSuffix={"%"}
        />
      ) : (
        <View style={styles.buttonContainer}>
          <Pressable onPress={onPress} style={styles.logbookButton}>
            <Text style={styles.logbookButtonText}>Log Book</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  challengeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
    padding: 10,
  },
  challengeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    fontFamily: "Avenir",
  },
  challengeImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 3,
    justifyContent: "center",
    paddingRight: 10,
    fontFamily: "Avenir",
  },
  challengeTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    fontFamily: "Avenir",
  },
  challengeDetails: {
    fontSize: 14,
    color: "gray",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  logbookButton: {
    padding: 7,
    borderRadius: 20,
    backgroundColor: "#61B8C2",
  },
  logbookButtonText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Avenir",
  },
});
