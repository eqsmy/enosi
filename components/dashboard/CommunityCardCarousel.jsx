import { ScrollView, View, StyleSheet, Image, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export function CommunityCardCarosel() {
  return (
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
            marginRight: index !== exampleCommunities.length - 1 ? 12 : 0, // Add right margin to all but the last item
          }}
        >
          <CommunityCard key={index} communityData={community} />
        </View>
      ))}
      <View style={{ width: 32 }} />
    </ScrollView>
  );
}

export const CommunityCard = ({ communityData }) => (
  <View style={stylesCommunityCard.cardContainer}>
    <Image
      source={{ uri: communityData.header_photo_url }}
      style={stylesCommunityCard.headerImage}
    />
    <Image
      source={{ uri: communityData.profile_photo_url }}
      style={stylesCommunityCard.profileImage}
    />
    <View style={stylesCommunityCard.contentContainer}>
      <Text style={stylesCommunityCard.title} numberOfLines={1}>
        {communityData.name}
      </Text>
      <Text style={stylesCommunityCard.description} numberOfLines={2}>
        {communityData.description}
      </Text>
      <View style={stylesCommunityCard.statsContainer}>
        {/* Insert IoIcon here */}
        <Ionicons name="people-outline" size={16} color="black" />
        <Text style={stylesCommunityCard.statText}>
          {communityData.members.length}
        </Text>
        <Ionicons name="flash-outline" size={16} color="black" />
        <Text style={stylesCommunityCard.statText}>{communityData.challenges.length}</Text>
      </View>
      {/* <ScrollView horizontal style={stylesCommunityCard.tagContainer}>
        {communityData.categoryTags.map((tag, index) => (
          <View key={index} style={stylesCommunityCard.tag}>
            <Text style={stylesCommunityCard.tagText}>{tag}</Text>
          </View>
        ))}
      </ScrollView> */}
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
    padding: 16,
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
