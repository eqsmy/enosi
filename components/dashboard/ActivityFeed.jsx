import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { calculateProgress } from "@components/dashboard/ChallengeCardCarousel";
import { useFeedStore } from "@stores/stores";
import { useNavigation } from "@react-navigation/native";
import { useCommunityDetailStore } from "@stores/stores";
import { prepareFeedData } from "@stores/stores";
import { enosiStyles } from "@pages/styles";
import { COLORS } from "../../constants";

const timeAgo = (timestamp) => {
  timestamp = new Date(timestamp).getTime();
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return `${interval} years`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} days`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} hours`;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} minutes`;
  }
  return `${Math.floor(seconds)} seconds`;
};

const PostCard = ({ post }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Icon name="telescope" size={24} color="#000" /> */}
        <Image
          source={{ uri: post.creator.avatar_url }}
          style={styles.profileImage}
        />
        <Text
          style={styles.subreddit}
        >{`${post.creator.first_name} ${post.creator.last_name}`}</Text>
        {/* <Text style={styles.time}>· 19h · scientificamerican.com</Text> */}
        <Text style={styles.time}>{` · ${timeAgo(post.created_at)}`}</Text>
        <Text style={styles.name}>{`${post.community.name}`}</Text>
      </View>
      {post.image_url && (
        <Image source={{ uri: post.image_url }} style={styles.image_url} />
      )}
      <Text style={styles.title}>{post.comment}</Text>
    </View>
  );
};

const ContributionCard = ({ contribution, showProgressBar = true }) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("CommunityDetail", {
      communityId: contribution.community.id,
    });
  };

  const formattedGoal = `${contribution.challenge.current_total?.toLocaleString()} / ${contribution.challenge.goal_total?.toLocaleString()} ${
    contribution.challenge.unit
  }`;
  return (
    <View style={styles.contributionContainer}>
      <View style={styles.contributionHeader}>
        <Image
          source={{ uri: contribution.creator.avatar_url }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>
          {`${contribution.creator.first_name} ${contribution.creator.last_name}`}
        </Text>
        <Text style={styles.timeAgo}>{` · ${timeAgo(
          contribution.created_at
        )}`}</Text>
        <TouchableOpacity style={{ marginLeft: "auto" }} onPress={handlePress}>
          <Text style={styles.communityName}>
            {contribution.community.name}
          </Text>
        </TouchableOpacity>
      </View>
      {contribution.image_url && (
        <Image
          source={{ uri: contribution.image_url }}
          style={styles.contributionImage}
        />
      )}
      <View style={styles.contributionContent}>
        {contribution.comment && (
          <Text style={styles.contributionText}>{contribution.comment}</Text>
        )}
        <Text style={styles.contributionDetail}>
          {`Contributed ${contribution.contribution} ${contribution.unit} for `}
          <Text
            style={styles.challengeName}
          >{`"${contribution.challenge?.name}"`}</Text>
        </Text>
        {showProgressBar && (
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={{
                  ...styles.progressBarFill,
                  width: calculateProgress(
                    contribution.challenge.current_total,
                    contribution.challenge.goal_total
                  ), // Dynamic based on progress
                }}
              />
            </View>
            <View style={styles.goalContainer}>
              {/* <View /> */}
              <Text style={styles.goalText}>{formattedGoal}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export const ActivityFeed = () => {
  const { feed } = useFeedStore();

  const renderItem = ({ item, index }) => {
    return (
      <View key={item.id}>
        {item.type === "feed" ? (
          <PostCard post={item} />
        ) : (
          <ContributionCard contribution={item} />
        )}
        {/* Render the separator line if it's not the last item */}
        {index !== feed.length - 1 && <View style={enosiStyles.separator} />}
      </View>
    );
  };

  return (
    <>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginHorizontal: 16,
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        Activity Feed
      </Text>
      <View style={{ marginBottom: 32 }}>
        {feed.map((item, index) => renderItem({ item, index }))}
      </View>
    </>
  );
};

const ContributionCardChallengeDetail = ({ contribution }) => {
  return (
    <View style={styles.contributionContainerDetail}>
      <View style={styles.contributionHeader}>
        <Image
          source={{ uri: contribution.contributor_info.avatar_url }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>
          {`${contribution.contributor_info.first_name} ${contribution.contributor_info.last_name}`}
        </Text>
        <Text style={styles.timeAgo}>{` · ${timeAgo(
          contribution.created_at
        )}`}</Text>
        {/* <Text style={styles.communityName}>{contribution.community.name}</Text> */}
      </View>
      {contribution.image_url && (
        <Image
          source={{ uri: contribution.image_url }}
          style={styles.contributionImage}
        />
      )}
      <View style={styles.contributionContent}>
        {contribution.comment && (
          <Text style={styles.contributionText}>{contribution.comment}</Text>
        )}
        <Text style={styles.contributionDetail}>
          {`Contributed ${contribution.contribution} ${contribution.unit}`}
        </Text>
      </View>
    </View>
  );
};

export const ActivityFeedChallengeDetail = ({ contributions }) => {
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <ContributionCardChallengeDetail contribution={item} />
        {/* Render the separator line if it's not the last item */}
        {index !== contributions.length - 1 && (
          <View style={enosiStyles.separator} />
        )}
      </View>
    );
  };

  return (
    <>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          // marginHorizontal: 16,
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        Contributions
      </Text>
      <View style={{ marginBottom: 32 }}>
        {contributions && contributions.length > 0 ? (
          contributions.map((item, index) => renderItem({ item, index }))
        ) : (
          <Text style={{ textAlign: "center", color: "gray" }}>
            No contributions yet.
          </Text>
        )}
      </View>
    </>
  );
};

const PostCommunityDetailCard = ({ post }) => {
  return (
    <View>
      <View style={styles.header}>
        {/* <Icon name="telescope" size={24} color="#000" /> */}
        <Image
          source={{ uri: post.creator.avatar_url }}
          style={styles.profileImage}
        />
        <Text
          style={styles.subreddit}
        >{`${post.creator.first_name} ${post.creator.last_name}`}</Text>
        {/* <Text style={styles.time}>· 19h · scientificamerican.com</Text> */}
        <Text style={styles.time}>{` · ${timeAgo(post.created_at)}`}</Text>
        {/* <Text style={styles.name}>{`${post.community.name}`}</Text> */}
      </View>
      {post.image_url && (
        <Image source={{ uri: post.image_url }} style={styles.image_url} />
      )}
      <Text style={styles.title}>{post.comment}</Text>
    </View>
  );
};

const ContributionCommunityDetailCard = ({
  contribution,
  showProgressBar = true,
}) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("CommunityDetail", {
      communityId: contribution.community.id,
    });
  };

  const formattedGoal = `${contribution.total_before_contribution?.toLocaleString()} / ${contribution.goal_total?.toLocaleString()} ${
    contribution.unit
  }`;

  return (
    <View>
      <View style={styles.contributionHeader}>
        <Image
          source={{ uri: contribution.creator.avatar_url }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>
          {`${contribution.creator.first_name} ${contribution.creator.last_name}`}
        </Text>
        <Text style={styles.timeAgo}>{` · ${timeAgo(
          contribution.created_at
        )}`}</Text>
        {/* <TouchableOpacity style={{ marginLeft: "auto" }} onPress={handlePress}>
          <Text style={styles.communityName}>
            {contribution.community.name}
          </Text>
        </TouchableOpacity> */}
      </View>
      {contribution.image_url && (
        <Image
          source={{ uri: contribution.image_url }}
          style={styles.contributionImage}
        />
      )}
      <View style={styles.contributionContent}>
        {contribution.comment && (
          <Text style={styles.contributionText}>{contribution.comment}</Text>
        )}
        <Text style={styles.contributionDetail}>
          {`Contributed ${contribution.contribution} ${contribution.unit} for `}
          <Text
            style={styles.challengeName}
          >{`"${contribution.challenge_name}"`}</Text>
        </Text>
        {showProgressBar && (
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={{
                  ...styles.progressBarFill,
                  width: calculateProgress(
                    contribution.total_before_contribution,
                    contribution.goal_total
                  ), // Dynamic based on progress
                }}
              />
            </View>
            <View style={styles.goalContainer}>
              {/* <View /> */}
              <Text style={styles.goalText}>{formattedGoal}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export const ActivityFeedCommunityDetail = () => {
  const { loading, communityDetailFeed } = useCommunityDetailStore();
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        {item.type === "feed" ? (
          <PostCommunityDetailCard post={item} />
        ) : (
          <ContributionCommunityDetailCard contribution={item} />
        )}
        {/* Render the separator line if it's not the last item */}
        {index !== communityDetailFeed.length - 1 && (
          <View style={enosiStyles.separator} />
        )}
      </View>
    );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!communityDetailFeed) {
    return <Text>No activity yet.</Text>;
  }

  return (
    <>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          // marginHorizontal: 16,
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        Community Feed
      </Text>
      <View style={{ marginBottom: 32 }}>
        {communityDetailFeed.map((item, index) => renderItem({ item, index }))}
      </View>
    </>
  );
};

const PostProfileCard = ({ post }) => {
  return (
    <View>
      {post.image_url && (
        <Image source={{ uri: post.image_url }} style={styles.image_url} />
      )}
      <Text style={styles.title}>{post.comment}</Text>
    </View>
  );
};

const ContributionProfileCard = ({ contribution, showProgressBar = true }) => {
  const navigation = useNavigation();
  const formattedGoal = `${contribution.total_before_contribution?.toLocaleString()} / ${contribution.goal_total?.toLocaleString()} ${
    contribution.unit
  }`;

  return (
    <View>
      {contribution.image_url && (
        <Image
          source={{ uri: contribution.image_url }}
          style={styles.contributionImage}
        />
      )}
      <View style={styles.contributionContent}>
        {contribution.comment && (
          <Text style={styles.contributionText}>{contribution.comment}</Text>
        )}
        <Text style={styles.contributionDetail}>
          {`Contributed ${contribution.contribution} ${contribution.unit} for `}
          <Text
            style={styles.challengeName}
          >{`"${contribution.challenge_name}"`}</Text>
        </Text>
        {showProgressBar && (
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={{
                  ...styles.progressBarFill,
                  width: calculateProgress(
                    contribution.total_before_contribution,
                    contribution.goal_total
                  ), // Dynamic based on progress
                }}
              />
            </View>
            <View style={styles.goalContainer}>
              {/* <View /> */}
              <Text style={styles.goalText}>{formattedGoal}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export const ActivityFeedProfile = ({ contributions, posts }) => {
  const data = prepareFeedData(contributions, posts);

  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        {item.type === "feed" ? (
          <PostProfileCard post={item} />
        ) : (
          <ContributionProfileCard contribution={item} />
        )}
        {/* Render the separator line if it's not the last item */}
        {index !== data.length - 1 && <View style={styles.separator} />}
      </View>
    );
  };

  return (
    <View style={{ marginBottom: 32 }}>
      {data.map((item, index) => renderItem({ item, index }))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  subreddit: {
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "lightgrey",
    marginVertical: 8,
  },
  time: {
    color: "#555",
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
  },
  name: {
    fontWeight: "500",
    marginLeft: "auto",
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "lightgrey",
    marginRight: 8,
  },
  image_url: {
    width: "100%",
    height: 200,
    marginBottom: 8,
    borderRadius: 8,
  },
  contributionContainer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
  },
  contributionContainerDetail: {
    backgroundColor: "#FFF",
  },
  contributionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  userName: {
    fontWeight: "bold",
  },
  timeAgo: {
    color: "#555",
  },
  communityName: {
    fontWeight: "500",
  },
  contributionImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
  },
  contributionContent: {
    marginTop: 8,
  },
  contributionText: {
    fontSize: 14,
    marginBottom: 4,
  },
  contributionDetail: {
    fontSize: 12,
    color: "#555",
  },
  challengeName: {
    fontWeight: "bold",
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 8,
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
});
