import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useUser } from "../utils/UserContext.js";
import { supabase } from "../utils/Supabase.js";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { COLORS, FONTS } from "../constants.js";
import { ActivityFeedProfile } from "@components/dashboard/ActivityFeed";
import { insertFriend, removeFriend, fetchProfile } from "@stores/api";

export default function ProfilePage({ route }) {
  const { state, dispatch } = useUser();
  const [activeTab, setActiveTab] = useState("friends");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const currentUserID = route?.params?.user_id || state.session.user.id;
  const userIsMe =
    route?.params?.user_id == state.session.user.id || !route?.params?.user_id;

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const { data, error } = await fetchProfile(supabase, currentUserID);
      if (data) {
        setProfile(data);
      }
      setLoading(false);
    }

    fetch();
  }, []);

  const handleFollow = async () => {
    if (following) {
      const { data, error } = await removeFriend(
        supabase,
        state.session.user.id,
        currentUserID
      );
      if (data) {
        setProfile(data);
      }
    } else {
      const { data, error } = await insertFriend(
        supabase,
        state.session.user.id,
        currentUserID
      );
      if (data) {
        setProfile(data);
      }
    }
  };

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  if (!profile) {
    return <Text>Profile not found</Text>;
  }
  // check if we follow the user or not
  const following =
    profile.friends && profile.friends.length > 0
      ? profile.friends.find(
          (follower) => follower.friend_id === state.session.user.id
        )
      : null;

  const renderList = () => {
    if (activeTab === "friends") {
      if (!profile.friends) {
        return <Text>Add friends using the search tab!</Text>;
      }
      return profile.friends.map((item, index) => (
        <View key={index}>
          <FriendListItem friend={item} />
          {index !== profile?.length - 1 && (
            <View
              style={{
                height: 1,
                backgroundColor: "lightgrey",
                marginVertical: 8,
              }}
            />
          )}
        </View>
      ));
    } else if (activeTab === "communities") {
      if (!profile.communities) {
        return <Text>Join communities using the search tab!</Text>;
      }
      return profile.communities.map((item, index) => (
        <View key={index}>
          <CommunitiesListItem community={item} />
          {index !== profile?.length - 1 && (
            <View
              style={{
                height: 1,
                backgroundColor: "lightgrey",
                marginVertical: 8,
              }}
            />
          )}
        </View>
      ));
    } else if (activeTab === "contributions") {
      if (!profile.contributions) {
        return <Text>Make contributions to communities!</Text>;
      }
      return (
        <ActivityFeedProfile
          contributions={profile.contributions}
          posts={profile.feeds}
        />
      );
    }

    return list.map((item, index) => (
      <Text key={index} style={{ marginVertical: 10 }}>
        {item}
      </Text>
    ));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#FFF", position: "relative" }}
    >
      <ScrollView style={{ flex: 1, backgroundColor: "#FFF" }}>
        <View style={{ alignItems: "center", padding: 20 }}>
          <Image
            source={{ uri: profile.avatar_url }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 3,
              borderColor: "#f0f0f0",
            }}
          />
          <Text style={{ fontWeight: "bold", fontSize: 24, marginTop: 10 }}>
            {`${profile.first_name} ${profile.last_name}`}
          </Text>
          {profile.bio && (
            <Text
              style={{ fontStyle: "italic", color: "#555", marginBottom: 10 }}
            >
              {profile.bio}
            </Text>
          )}
          <View style={{ flexDirection: "row", marginVertical: 10 }}>
            <Text style={{ color: "#555" }}>
              {`${profile?.communities?.length || 0} communities - ${
                profile?.friends?.length
              } friends`}
            </Text>
          </View>
          {!userIsMe && (
            <View style={{ flexDirection: "row", marginVertical: 10 }}>
              <TouchableOpacity
                style={{
                  marginRight: 10,
                  backgroundColor: COLORS.primary,
                  padding: 10,
                  borderRadius: 20,
                }}
                onPress={handleFollow}
              >
                {following ? (
                  <Text style={{ color: "#FFF" }}>Unfollow</Text>
                ) : (
                  <Text style={{ color: "#FFF" }}>Follow</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#f0f0f0",
          }}
        >
          <TouchableOpacity onPress={() => setActiveTab("friends")}>
            <Text
              style={{
                color: activeTab === "friends" ? COLORS.primary : "#000",
                fontWeight: activeTab === "friends" ? "bold" : "normal",
              }}
            >
              Friends
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("communities")}>
            <Text
              style={{
                color: activeTab === "communities" ? COLORS.primary : "#000",
                fontWeight: activeTab === "communities" ? "bold" : "normal",
              }}
            >
              Communities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("contributions")}>
            <Text
              style={{
                color: activeTab === "contributions" ? COLORS.primary : "#000",
                fontWeight: activeTab === "contributions" ? "bold" : "normal",
              }}
            >
              Contributions
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ padding: 20 }}>{renderList()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const FriendListItem = ({ friend }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.push("Profile", {
          user_id: friend.friend_id,
        })
      }
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: friend.avatar_url }}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
        />
        <Text
          style={{ fontWeight: "bold" }}
        >{`${friend.first_name} ${friend.last_name}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const CommunitiesListItem = ({ community }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("CommunityDetail", {
          communityId: community.community_id,
        })
      }
    >
      <View style={styles.communityArea}>
        <Image
          source={{ uri: community.header_photo_url }} // Replace with your subreddit icon
          style={styles.subredditIcon}
        />

        <View style={styles.headerTextContainer}>
          <Text style={styles.subredditTitle}>{community.name}</Text>
          <Text style={styles.postDetails}>{community.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  communityTitle: {
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  skeletonLoader: {
    backgroundColor: "#E1E9EE",
    marginVertical: 8,
  },
  skeletonImageHeader: {
    height: 100,
    // rounded corners
    borderRadius: 90,
    width: 100,
  },
  skeletonTitle: {
    height: 24,
    width: "70%",
    alignSelf: "center",
  },
  skeletonDescription: {
    height: 16,
    width: "90%",
    alignSelf: "center",
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonStatusBadge: {
    height: 20,
    width: "20%",
    borderRadius: 10,
  },
  skeletonDate: {
    height: 16,
    width: "30%",
    marginLeft: 8,
  },
  skeletonTab: {
    height: 20,
    width: "30%",
    marginHorizontal: 5,
  },
  skeletonList: {
    height: 100,
    width: "100%",
  },
});

const SkeletonLoader = ({ style }) => (
  <View style={[styles.skeletonLoader, style]} />
);

const ProfilePageSkeleton = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        alignItems: "center",
        padding: 20,
      }}
    >
      {/* Header placeholder */}
      <SkeletonLoader style={styles.skeletonImageHeader} />

      {/* Profile name placeholder */}
      <SkeletonLoader style={styles.skeletonTitle} />

      {/* Profile details placeholder */}
      <SkeletonLoader style={styles.skeletonDescription} />
      <View style={styles.skeletonRow}>
        <SkeletonLoader style={styles.skeletonStatusBadge} />
        <SkeletonLoader style={styles.skeletonDate} />
      </View>

      {/* Tabs placeholder */}
      <View style={styles.skeletonRow}>
        <SkeletonLoader style={styles.skeletonTab} />
        <SkeletonLoader style={styles.skeletonTab} />
        <SkeletonLoader style={styles.skeletonTab} />
      </View>

      {/* List placeholder */}
      <SkeletonLoader style={styles.skeletonList} />
    </View>
  );
};
