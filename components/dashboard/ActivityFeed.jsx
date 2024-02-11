import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { calculateProgress } from "@components/dashboard/ChallengeCardCarousel";

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

const ContributionCard = ({ contribution }) => {
  const formattedGoal = `${contribution.challenge.progressCount.toLocaleString()} / ${contribution.challenge.goal.toLocaleString()} ${
    contribution.challenge.units
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
        <Text style={styles.communityName}>{contribution.community.name}</Text>
      </View>
      {contribution.image_url && (
        <Image
          source={{ uri: contribution.image_url }}
          style={styles.contributionImage}
        />
      )}
      <View style={styles.contributionContent}>
        <Text style={styles.contributionText}>{contribution.comment}</Text>
        <Text style={styles.contributionDetail}>
          {`Contributed ${contribution.contribution} ${contribution.unit} for `}
          <Text
            style={styles.challengeName}
          >{`"${contribution.challenge?.challengeTitle}"`}</Text>
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={{
                ...styles.progressBarFill,
                width: calculateProgress(
                  contribution.challenge.progressCount,
                  contribution.challenge.goal
                ), // Dynamic based on progress
              }}
            />
          </View>
          <View style={styles.goalContainer}>
            {/* <View /> */}
            <Text style={styles.goalText}>{formattedGoal}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const feedData = [
  {
    type: "contribution",
    id: "779e72c3-e517-485b-ba46-a551b5b",
    community: {
      community_id: "c1ec7eda-8bff-4a5c-92d8-2a0b8858b8e7",
      name: "Walkers United",
      profile_photo_url:
        "https://s3.amazonaws.com/images.gearjunkie.com/uploads/2016/12/people-walker-3.jpg",
    },
    challenge: {
      challengeTitle: "Climb Mount Everest",
      progressCount: 16000,
      goal: 29500,
      units: "ft",
      status: "active",
      contributors: 12,
    },
    image_url: null,
    contribution: 2000,
    unit: "ft",
    comment: "Just climbed 2000 feet on the stairmaster. Let's go!",
    created_at: "2024-02-07T03:04:37.391144+00:00",
    creator: {
      first_name: "Tristan",
      last_name: "Sinclair",
      avatar_url:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
  },
  {
    type: "feed",
    id: "b062c232-2518-41cf-a7d2-53493edce123",
    community: {
      community_id: "c1ec7eda-8bff-4a5c-92d8-2a0b8858b8e7",
      name: "Walkers United",
      profile_photo_url:
        "https://s3.amazonaws.com/images.gearjunkie.com/uploads/2016/12/people-walker-3.jpg",
    },
    image_url: null,
    contribution: null,
    unit: null,
    comment:
      "So grateful for this community! I joined 2 weeks ago and I've walked 20 miles! I feel great!",
    created_at: "2024-02-07T03:04:37.391144+00:00",
    creator: {
      first_name: "John",
      last_name: "Cena",
      avatar_url:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
  },
  {
    type: "feed",
    id: "b062c232-2518-41cf-a7d2-53493edce2fd",
    community: {
      community_id: "c1ec7eda-8bff-4a5c-92d8-2a0b8858b8e7",
      name: "Walkers United test",
      profile_photo_url:
        "https://s3.amazonaws.com/images.gearjunkie.com/uploads/2016/12/people-walker-3.jpg",
    },
    image_url:
      "https://www.delta.edu/_resources/images/universal-1920x1282/walking-trail-001.jpg",
    contribution: null,
    unit: null,
    comment: "Just walked 5 miles!",
    created_at: "2024-02-07T03:04:37.391144+00:00",
    creator: {
      first_name: "Tristan",
      last_name: "Sinclair",
      avatar_url:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
  },
  {
    type: "contribution",
    id: "779e72c3-e517-485b-ba46-a551b5b5a974",
    challenge: {
      challengeTitle: "Walk Across America",
      progressCount: 1200,
      goal: 3000,
      units: "mi",
      status: "active",
      contributors: 12,
    },
    community: {
      community_id: "c1ec7eda-8bff-4a5c-92d8-2a0b8858b8e7",
      name: "Walkers United",
      profile_photo_url:
        "https://s3.amazonaws.com/images.gearjunkie.com/uploads/2016/12/people-walker-3.jpg",
    },
    image_url:
      "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    contribution: 5,
    unit: "miles",
    comment:
      "Just got back from a 5 mile walk! Let's get this challenge complete!",
    created_at: "2024-02-07T03:04:37.391144+00:00",
    creator: {
      first_name: "Taylor",
      last_name: "Swift",
      avatar_url:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
  },
  {
    type: "contribution",
    id: "779e72c3-e517-485b-ba46-a551b5b5a9432",
    community: {
      community_id: "c1ec7eda-8bff-4a5c-92d8-2a0b8858b8e7",
      name: "Walkers United",
      profile_photo_url:
        "https://s3.amazonaws.com/images.gearjunkie.com/uploads/2016/12/people-walker-3.jpg",
    },
    challenge: {
      challengeTitle: "Walk Across America",
      progressCount: 1200,
      goal: 3000,
      units: "mi",
      status: "active",
      contributors: 12,
    },
    image_url: null,
    contribution: 8,
    unit: "miles",
    comment: "Felt great to contribute!",
    created_at: "2024-02-07T03:04:37.391144+00:00",
    creator: {
      first_name: "Tristan",
      last_name: "Sinclair",
      avatar_url:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
  },
];

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
  separator: {
    height: 1,
    backgroundColor: "lightgrey",
    marginVertical: 8,
  },
  contributionContainer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
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
    marginLeft: "auto",
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
    backgroundColor: "#4caf50",
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

export default ActivityFeed = () => {
  const renderItem = ({ item, index }) => {
    return (
      <View key={item.id}>
        {item.type === "feed" ? (
          <PostCard post={item} />
        ) : (
          <ContributionCard contribution={item} />
        )}
        {/* Render the separator line if it's not the last item */}
        {index !== feedData.length - 1 && <View style={styles.separator} />}
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
        {feedData.map((item, index) => renderItem({ item, index }))}
      </View>
    </>
  );
};
