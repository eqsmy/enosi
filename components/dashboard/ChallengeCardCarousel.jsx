import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useFeedStore } from "@stores/stores.js";
import { useNavigation } from '@react-navigation/native';
import { COLORS } from "../../constants";


export const calculateProgress = (progressCount, goal) => {
  if (!progressCount || !goal) return "0%";
  return `${(progressCount / goal) * 100}%`;
};

function ChallengeCard({ challengeData }) {
  const navigation = useNavigation();
  const handlePress = () => {
    console.log("challengeData", challengeData);
    navigation.navigate("ChallengeDetail", { challengeId: challengeData.challenge_id });
  };

  //   format the goal based on the units, add commas to the number
  const formattedGoal = `${challengeData.current_total.toLocaleString()} / ${challengeData.goal_total.toLocaleString()} ${challengeData.unit
    }`;

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.cardContainer}>
        {challengeData.community ?
          <Text style={styles.communityNameText} numberOfLines={1}>
            {challengeData.community.community_name}
          </Text> : null}
        <Text style={styles.titleText} numberOfLines={1}>
          {challengeData.challenge_name}
        </Text>
        <View style={styles.deliveryTimeContainer}>
          <View style={styles.deliveryTimeBadge}>
            <Text style={styles.deliveryTimeBadgeText}>
              {challengeData.status.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.contributorsText}>
            {`${challengeData?.total_contributors} contributors`}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={{
                ...styles.progressBarFill,
                width: calculateProgress(
                  challengeData.current_total,
                  challengeData.goal_total
                ), // Dynamic based on progress
              }}
            />
          </View>
          <View style={styles.goalContainer}>
            {/* <View /> */}
            <Text style={styles.goalText}>{formattedGoal}</Text>
          </View>
        </View>
        {/* Community Logo */}
        {challengeData.community ?
          <Image
            style={styles.logo}
            source={{
              uri: challengeData.community.profile_photo_url,
            }}
          /> : null}
      </View>
    </TouchableOpacity>
  );
}

export function ChallengeCardCarousel({ style, challenges = undefined }) {
  const { activeChallenges } = useFeedStore();

  return (
    <ScrollView
      horizontal={true}
      style={{
        paddingHorizontal: 16,
        paddingBottom: 8,
        ...style,
      }}
    >
      {(challenges ?? activeChallenges).map((challenge, index) => (
        <View
          key={index}
          style={{
            marginRight: index !== (challenges ?? activeChallenges).length - 1 ? 12 : 0, // Add right margin to all but the last item
          }}
        >
          <ChallengeCard key={index} challengeData={challenge} />
        </View>
      ))}
      <View style={{ width: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "lightgrey",
    width: 250,
  },
  communityNameText: {
    color: "grey",
    fontWeight: "bold",
    marginRight: 18,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  deliveryTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  deliveryTimeBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 10,
  },
  deliveryTimeBadgeText: {
    color: "white",
    fontWeight: "bold",
  },
  contributorsText: {
    fontWeight: "700",
  },
  progressBarContainer: {
    marginTop: 4,
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  goalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  goalText: {
    color: "grey",
  },
  activeGoalText: {
    color: "black",
    fontWeight: "bold",
  },
  activeGoalIndicator: {
    height: 2,
    width: "100%",
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
  logo: {
    height: 30,
    width: 30,
    resizeMode: "cover",
    position: "absolute", // Position the logo as per your design requirements
    top: 16,
    right: 16,
    borderRadius: 50,
  },
});
