import { Text, View, Image, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { Header } from "@components/dashboard/Header";

export const calculateProgress = (progressCount, goal) => {
  if (!progressCount || !goal) return "0%";
  return `${(progressCount / goal) * 100}%`;
};

function ChallengeCard({ challengeData }) {
  //   format the goal based on the units, add commas to the number
  const formattedGoal = `${challengeData.progressCount.toLocaleString()} / ${challengeData.goal.toLocaleString()} ${
    challengeData.units
  }`;

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.communityNameText} numberOfLines={1}>
        {challengeData.communityName}
      </Text>
      <Text style={styles.titleText} numberOfLines={1}>
        {challengeData.challengeTitle}
      </Text>
      <View style={styles.deliveryTimeContainer}>
        <View style={styles.deliveryTimeBadge}>
          <Text style={styles.deliveryTimeBadgeText}>
            {challengeData.status.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.contributorsText}>
          {`${challengeData.contributors} contributors`}
        </Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={{
              ...styles.progressBarFill,
              width: calculateProgress(
                challengeData.progressCount,
                challengeData.goal
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
      <Image
        style={styles.logo}
        source={{
          uri: challengeData.communityLogo,
        }}
      />
    </View>
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
    backgroundColor: "green",
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
    backgroundColor: "green",
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
    backgroundColor: "green",
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

export const exampleChallenges = [
  {
    communityName: "CS 194H Squad",
    challengeTitle: "Everest Climb",
    progressCount: 26000,
    goal: 29500,
    units: "ft",
    status: "active",
    contributors: 38,
    communityLogo:
      "https://assets.weforum.org/article/image/XaHpf_z51huQS_JPHs-jkPhBp0dLlxFJwt-sPLpGJB0.jpg",
  },
  {
    communityName: "Neighborhood Walkers",
    challengeTitle: "Walk Across America",
    progressCount: 1200,
    goal: 3000,
    units: "mi",
    status: "active",
    contributors: 12,
    communityLogo:
      "https://assets.weforum.org/article/image/XaHpf_z51huQS_JPHs-jkPhBp0dLlxFJwt-sPLpGJB0.jpg",
  },
  {
    communityName: "EVGR 101",
    challengeTitle: "Beach Cleanup",
    progressCount: 10,
    goal: 25,
    units: "hours",
    status: "active",
    contributors: 5,
    communityLogo:
      "https://assets.weforum.org/article/image/XaHpf_z51huQS_JPHs-jkPhBp0dLlxFJwt-sPLpGJB0.jpg",
  },
];

export function ChallengeCardCarousel({ style }) {
  return (
    <ScrollView
      horizontal={true}
      style={{
        paddingHorizontal: 16,
        paddingBottom: 8,
        ...style,
      }}
    >
      {exampleChallenges.map((challenge, index) => (
        <View
          key={index}
          style={{
            marginRight: index !== exampleChallenges.length - 1 ? 12 : 0, // Add right margin to all but the last item
          }}
        >
          <ChallengeCard key={index} challengeData={challenge} />
        </View>
      ))}
      <View style={{ width: 32 }} />
    </ScrollView>
  );
}
