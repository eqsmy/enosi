import React, { useEffect, useMemo } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { supabase } from "../utils/Supabase";
import { useCommunityDetailStore } from "@stores/stores";
import { COLORS } from "../constants";
import BackButton from "@components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { ActivityFeedCommunityDetail } from "@components/dashboard/ActivityFeed";
import { useUser } from "../utils/UserContext";
import { ChallengeCardCarousel } from "../components/dashboard/ChallengeCardCarousel";
import { Header } from "../components/dashboard/Header";
import { Icon } from "react-native-elements";
import { enosiStyles } from "./styles";
import { useChallengeStore } from "../stores/stores";
import { ChallengeCard } from "../components/ChallengeCard";
import { useState } from "react";

export function CommunityJoinChallenge({ route }) {
  const { communityId } = route.params;
  const { state } = useUser();
  const { availableChallenges } = useChallengeStore()
  const {
    communityDetail,
    fetchCommunityDetail
  } = useCommunityDetailStore();

  useEffect(() => {
    fetchCommunityDetail(supabase, communityId, state.session.user.id);
  }, []);
  const [search, setSearch] = useState("");
  const filteredSearchList = useMemo(() => {
    return availableChallenges.filter((item) => {
      return item.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, availableChallenges]);

  console.log(communityDetail.challenges)

  console.log(communityDetail.challenges.some((value) => {
    return value.challenge_master_id == "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f"
  }))

  return (
    <SafeAreaView style={enosiStyles.feedContainer}>
      <View
        style={{
          height: "100%",
          width: "90%",
          position: "absolute",
        }}
      >
        <TextInput
          placeholder="Search for challenges"
          style={enosiStyles.searchBar}
          value={search}
          onChangeText={setSearch}
        ></TextInput>
        <FlatList
          data={filteredSearchList}
          style={{ marginTop: 20 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => {
            return (
              <View>
                <ChallengeCard
                  name={item.name}
                  description={item.description}
                  header_image={item.header_image}
                  goal={item.goal_total}
                  unit={item.unit}
                  alreadyJoined={communityDetail.challenges.some((value) => {
                    return value.challenge_master_id == item.id
                  })}
                />
              </View>)
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default function CommunityDetail({ route }) {
  const { communityId } = route.params;
  const { state } = useUser();
  const {
    communityDetail,
    fetchCommunityDetail,
    loading,
    isMember,
    toggleJoin
  } = useCommunityDetailStore();
  const navigation = useNavigation();

  useEffect(() => {
    fetchCommunityDetail(supabase, communityId, state.session.user.id);
  }, []);

  if (loading) {
    return <CommunityDetailSkeleton />;
  }
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
        source={{ uri: communityDetail.header_photo_url }}
        style={styles.challengeImageHeader}
      />
      <View style={styles.screenContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: communityDetail.profile_photo_url }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              marginRight: 8,
            }}
          />
          <View>
            <Text style={styles.challengeTitle}>
              {communityDetail.community_name}
            </Text>
            <Text
              style={{
                color: COLORS.defaultgray,
              }}
            >{`${communityDetail.members?.length ?? 0} Members - ${communityDetail.location}`}</Text>
          </View>
          <TouchableOpacity
            style={isMember ? styles.leaveButton : styles.joinButton}
            onPress={() => {
              toggleJoin(supabase, state.session.user.id, communityId);
            }}
          >
            <Text style={isMember ? styles.leaveButtonText : styles.joinButtonText}>
              {isMember ? "Leave" : "Join"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.challengeDescription}>
          {communityDetail.community_description}
        </Text>
        <View>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Header title={"Active Challenges"} style={{ paddingHorizontal: 0 }} />
            <Icon size={30} color={COLORS.primary} name="add" type="material" onPress={() => { navigation.navigate("CommunityJoinChallenge", { communityId: communityId }) }} />
          </View>
          {communityDetail.challenges ?
            <ChallengeCardCarousel challenges={communityDetail.challenges} style={{ paddingHorizontal: 0 }} />
            : <Text style={{ marginBottom: 10 }}>No active challenges</Text>}
        </View>
        <ActivityFeedCommunityDetail />
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
  },
  challengeImageHeader: {
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
  leaveButton: {
    marginLeft: "auto",
    backgroundColor: "white",
    borderRadius: 15,
    borderColor: "blue",
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: "flex-start",
  },
  leaveButtonText: {
    color: "blue",
    fontWeight: "bold",
  }
});

const SkeletonLoader = ({ style }) => (
  <View style={[styles.skeletonLoader, style]} />
);

function CommunityDetailSkeleton() {
  return (
    <View style={{ flex: 1 }}>
      <SkeletonLoader style={styles.skeletonImageHeader} />
      <View style={styles.screenContainer}>
        <SkeletonLoader style={styles.skeletonTitle} />
        <View style={styles.skeletonRow}>
          <SkeletonLoader style={styles.skeletonStatusBadge} />
          <SkeletonLoader style={styles.skeletonDate} />
        </View>
        <SkeletonLoader style={styles.skeletonDescription} />
        <SkeletonLoader style={styles.skeletonProgressBar} />
        <View style={styles.skeletonCommunity}>
          <SkeletonLoader style={styles.skeletonSubredditIcon} />
          <View>
            <SkeletonLoader style={styles.skeletonSubredditTitle} />
            <SkeletonLoader style={styles.skeletonPostDetails} />
          </View>
        </View>
        <SkeletonLoader style={styles.skeletonActivityFeed} />
      </View>
    </View>
  );
}
