import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, Image, SafeAreaView } from "react-native";
import { supabase } from "../utils/Supabase";
import { useChallengeStore } from "@stores/stores";
import { AvatarStack } from "@components/Avatar";
import ProgressBar from "@components/ProgressBar";
import { ActivityFeedChallengeDetail } from "@components/dashboard/ActivityFeed";
import { COLORS } from "../constants";
import BackButton from "@components/BackButton";
import { useNavigation } from "@react-navigation/native";

export default function ChallengeDetail({ route }) {
  const { challengeId } = route.params;
  const { loading, challengeDetail, fetchChallengeDetail } =
    useChallengeStore();
  const navigation = useNavigation();

  useEffect(() => {
    fetchChallengeDetail(supabase, challengeId);
  }, []);

  if (loading) {
    return (
      <ChallengeDetailSkeleton />
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // Pad the month and day with leading zeros, if necessary
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;

    return `${month}/${day}/${year}`;
  };

  contributors = (challengeDetail.contributions || []).map((contribution) => {
    return {
      image: contribution.contributor_info.avatar_url,
      name: `${contribution.contributor_info.first_name} ${contribution.contributor_info.last_name}`,
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          position: "absolute",
          top: 0,
          left: 16,
          zIndex: 100,
        }}
      >
        <BackButton onPress={() => navigation.goBack()} />
      </SafeAreaView>
      <Image
        source={{ uri: challengeDetail.challenge_image }} // Replace with your subreddit icon
        style={styles.challengeImageHeader}
      />
      <View style={styles.screenContainer}>
        <Text style={styles.challengeTitle}>
          {challengeDetail.challenge_name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>
              {challengeDetail.status.toUpperCase()}
            </Text>
          </View>
          <Text
            style={{
              marginLeft: 8,
              color: COLORS.defaultgray,
            }}
          >{`${formatDate(challengeDetail.start_date)} - ${formatDate(
            challengeDetail.end_date
          )}`}</Text>
        </View>
        <Text style={styles.challengeDescription}>
          {challengeDetail.challenge_description}
        </Text>

        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            Progress
          </Text>
          <ProgressBar
            currentValue={challengeDetail.current_total}
            goalValue={challengeDetail.goal_total}
            size="large"
            unit={challengeDetail.unit}
          />
        </View>

        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 16,
              marginBottom: 4,
            }}
          >
            Community
          </Text>
          <View style={styles.communityArea}>
            <Image
              source={{ uri: challengeDetail.community.header_photo_url }} // Replace with your subreddit icon
              style={styles.subredditIcon}
            />

            <View style={styles.headerTextContainer}>
              <Text style={styles.subredditTitle}>
                {challengeDetail.community.name}
              </Text>
              <Text style={styles.postDetails}>
                {challengeDetail.community.description}
              </Text>
            </View>
          </View>
        </View>

        <ActivityFeedChallengeDetail
          contributions={challengeDetail.contributions}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    top: 150,
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    // paddingHorizontal: 16,
    // paddingVertical: 24,
  },
  challengeImageHeader: {
    // absolute top
    position: "absolute",
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 200,
  },
  challengeTitle: {
    fontWeight: "bold",
    fontSize: 24,
  },
  challengeDescription: {
    marginTop: 8,
    fontSize: 16,
    color: "grey",
  },

  communityArea: {
    flexDirection: "row",
    alignItems: "center",
  },

  subredditIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  subredditTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  postDetails: {
    fontSize: 12,
    color: "grey",
  },
  joinButton: {
    backgroundColor: "#blue",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: "flex-start",
  },
  joinButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  postDescription: {
    paddingHorizontal: 16,
    fontSize: 14,
  },
  seeMoreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  seeMoreText: {
    color: "#blue",
  },
  postContent: {
    padding: 16,
  },
  username: {
    color: "grey",
    marginBottom: 8,
  },
  postTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  bottomNavigator: {
    borderTopWidth: 1,
    borderTopColor: "lightgrey",
    padding: 16,
  },
  bottomNavText: {
    textAlign: "center",
    color: "grey",
  },
  statusBadge: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start", // Add this line
  },
  statusBadgeText: {
    color: "white",
    fontWeight: "bold",
  },

  // Skeleton styles
  skeletonLoader: {
    backgroundColor: '#e1e1e1',
    borderRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  skeletonImageHeader: {
    position: "absolute",
    top: 0,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 200,
  },
  skeletonTitle: {
    height: 24,
    width: '70%',
    marginVertical: 8,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  skeletonStatusBadge: {
    height: 20,
    width: '20%',
    borderRadius: 10,
  },
  skeletonDate: {
    height: 16,
    width: '50%',
    marginLeft: 8,
  },
  skeletonDescription: {
    height: 16,
    width: '90%',
    marginVertical: 8,
  },
  skeletonProgressBar: {
    height: 20,
    width: '100%',
    marginVertical: 16,
  },
  skeletonCommunity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  skeletonSubredditIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  skeletonSubredditTitle: {
    height: 18,
    width: '70%',
    marginVertical: 4,
  },
  skeletonPostDetails: {
    height: 12,
    width: '90%',
    marginVertical: 4,
  },
  skeletonActivityFeed: {
    height: 100,
    width: '100%',
    marginVertical: 8,
  },
});


const SkeletonLoader = ({ style }) => (
  <View style={[styles.skeletonLoader, style]} />
);

function ChallengeDetailSkeleton() {
  return (
    <View style={{ flex: 1 }}>
      {/* Image header placeholder */}
      <SkeletonLoader style={styles.skeletonImageHeader} />
      <View style={styles.screenContainer}>
        {/* Title placeholder */}
        <SkeletonLoader style={styles.skeletonTitle} />
        {/* Status badge and date placeholder */}
        <View style={styles.skeletonRow}>
          <SkeletonLoader style={styles.skeletonStatusBadge} />
          <SkeletonLoader style={styles.skeletonDate} />
        </View>
        {/* Description placeholder */}
        <SkeletonLoader style={styles.skeletonDescription} />
        {/* Progress bar placeholder */}
        <SkeletonLoader style={styles.skeletonProgressBar} />
        {/* Community section placeholder */}
        <View style={styles.skeletonCommunity}>
          <SkeletonLoader style={styles.skeletonSubredditIcon} />
          <View>
            <SkeletonLoader style={styles.skeletonSubredditTitle} />
            <SkeletonLoader style={styles.skeletonPostDetails} />
          </View>
        </View>
        {/* Activity feed placeholder */}
        <SkeletonLoader style={styles.skeletonActivityFeed} />
      </View>
    </View>
  );
}