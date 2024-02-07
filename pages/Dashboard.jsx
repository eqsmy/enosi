import {
  ScrollView,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { enosiStyles } from "./styles";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();

function Dashboard() {
  return (
    <SafeAreaView style={enosiStyles.feedContainer}>
      <ScrollView
        style={{
          flexDirection: "column",
          flex: 1,
          width: "100%",
        }}
      >
        <Header title={"Recent Challenges"} />
        <ScrollView
          horizontal={true}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            paddingBottom: 10,
            marginBottom: 16,
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
        <Header title={"Your Communities"} />
        <ScrollView
          horizontal={true}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            paddingBottom: 10,
            marginBottom: 16,
          }}
        >
          {exampleCommunities.map((community, index) => (
            <View
              key={index}
              style={{
                marginRight: index !== exampleChallenges.length - 1 ? 12 : 0, // Add right margin to all but the last item
              }}
            >
              <CommunityCard key={index} communityData={community} />
            </View>
          ))}
          <View style={{ width: 32 }} />
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const exampleCommunities = [
  {
    title: "CS 194H Squad",
    description:
      "Our group from CS 194H at Stanford University. We're working on a project to improve the user experience of a popular app.",
    members: "5",
    posts: "127",
    categoryTags: ["HCI", "Stanford", "Students"],
    headerImageUrl:
      "https://cdn.mos.cms.futurecdn.net/xaycNDmeyxpHDrPqU6LmaD-1200-80.jpg",
    profileUrl:
      "https://assets.weforum.org/article/image/XaHpf_z51huQS_JPHs-jkPhBp0dLlxFJwt-sPLpGJB0.jpg",
  },
  {
    title: "Neighborhood Walkers",
    description:
      "A group of neighbors who walk together every morning. We're trying to walk across America together.",
    members: "12",
    posts: "38",
    categoryTags: ["Fitness", "Walking", "Community"],
    headerImageUrl:
      "https://previews.123rf.com/images/olku/olku1805/olku180500033/102259092-groupe-of-old-people-walking-with-walkers.jpg",
    profileUrl:
      "https://compote.slate.com/images/66168178-3547-4917-8ea9-12938af61a04.jpg",
  },
];

const Header = ({ title }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
        paddingHorizontal: 16,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "700" }}>{title}</Text>
      <Ionicons name="ios-chevron-forward" size={20} color="black" />
    </View>
  );
};

function ChallengeCard({ challengeData }) {
  const calculateProgress = (progressCount, goal) => {
    if (!progressCount || !goal) return "0%";
    return `${(progressCount / goal) * 100}%`;
  };

  //   format the goal based on the units, add commas to the number
  const formattedGoal = `${challengeData.goal.toLocaleString()} ${
    challengeData.units
  }`;

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.communityName}>{challengeData.communityName}</Text>
      <Text style={styles.title} numberOfLines={1}>
        {challengeData.challengeTitle}
      </Text>
      <View style={styles.deliveryTimeContainer}>
        <View style={styles.deliveryTimeBadge}>
          <Text style={styles.deliveryTimeText}>
            {challengeData.status.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.deliveryTimeRange}>
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
        <View style={styles.stepsContainer}>
          <View />
          <Text style={styles.stepText}>{formattedGoal}</Text>
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
    width: 300,
  },
  communityName: {
    color: "grey",
    fontWeight: "bold",
  },
  title: {
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  deliveryTimeText: {
    color: "white",
    fontWeight: "bold",
  },
  deliveryTimeRange: {
    fontWeight: "bold",
  },
  progressBarContainer: {
    marginTop: 10,
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
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  stepText: {
    color: "grey",
  },
  activeStepText: {
    color: "black",
    fontWeight: "bold",
  },
  activeStepIndicator: {
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

const exampleChallenges = [
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

const CommunityCard = ({ communityData }) => (
  <View style={stylesCommunityCard.cardContainer}>
    <Image
      source={{ uri: communityData.headerImageUrl }}
      style={stylesCommunityCard.headerImage}
    />
    <Image
      source={{ uri: communityData.profileUrl }}
      style={stylesCommunityCard.profileImage}
    />
    <View style={stylesCommunityCard.contentContainer}>
      <Text style={stylesCommunityCard.title} numberOfLines={1}>
        {communityData.title}
      </Text>
      <Text style={stylesCommunityCard.description} numberOfLines={2}>
        {communityData.description}
      </Text>
      <View style={stylesCommunityCard.statsContainer}>
        {/* Insert IoIcon here */}
        <Ionicons name="people-outline" size={16} color="black" />
        <Text style={stylesCommunityCard.statText}>
          {communityData.members}
        </Text>
        <Ionicons name="flash-outline" size={16} color="black" />
        <Text style={stylesCommunityCard.statText}>{communityData.posts}</Text>
      </View>
      <ScrollView horizontal style={stylesCommunityCard.tagContainer}>
        {communityData.categoryTags.map((tag, index) => (
          <View key={index} style={stylesCommunityCard.tag}>
            <Text style={stylesCommunityCard.tagText}>{tag}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  </View>
);

const stylesCommunityCard = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "lightgrey",
    width: 200,
  },
  headerImage: {
    width: "100%",
    height: 80,
    position: "absolute",
    top: 0,
    left: 0,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "lightgrey",
    position: "absolute",
    top: 24,
    left: 10,
    zIndex: 1,
  },
  contentContainer: {
    marginTop: 50,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statText: {
    marginLeft: 5,
    marginRight: 15,
    fontSize: 14,
  },
  tagContainer: {
    flexDirection: "row",
    overflow: "hidden",
  },
  tag: {
    backgroundColor: "lightgrey",
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 4,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 12,
  },
});

export default function DashboardView() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: true,
        headerBackTitle: "Back",
        header: () => null,
      }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
}
