import {
  ScrollView,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Image,
  StyleSheet,
} from "react-native";
import { enosiStyles } from "./styles";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();

function Dashboard() {
  return (
    <SafeAreaView style={enosiStyles.feedContainer}>
      <View
        style={{
          flexDirection: "column",
          flex: 1,
          padding: 16,
          width: "100%",
        }}
      >
        <Header title={"Recent Challenges"} />
        <View
          style={{
            flexDirection: "row",
            gap: 12,
          }}
        >
          {exampleChallenges.map((challenge, index) => (
            <ChallengeCard key={index} challengeData={challenge} />
          ))}
        </View>
        {/* <Header title={"Your Communities"} /> */}
      </View>
    </SafeAreaView>
  );
}

const Header = ({ title }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "700" }}>{title}</Text>
      <Ionicons name="ios-chevron-forward" size={20} color="black" />
    </View>
  );
};

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
];

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
    width: 275, // Add this line
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
    height: 40,
    width: 40,
    resizeMode: "cover",
    position: "absolute", // Position the logo as per your design requirements
    top: 16,
    right: 16,
    borderRadius: 50,
  },
});
