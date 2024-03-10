import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import CommunityCard from "../components/CommunityCard";
import FloatingButton from "../components/FloatingButton";
import { COLORS, FONTS } from "../constants";
import { useCommunitiesStore, useCommunityDetailStore } from "../stores/stores";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { supabase } from "../utils/Supabase";
import { useUser } from "../utils/UserContext";

const CommunitiesList = () => {
  const { communities, fetchCommunitiesView } = useCommunitiesStore();
  const { state } = useUser();

  useEffect(() => {
    fetchCommunitiesView(supabase, state.session.user.id);
  }, [useIsFocused()]);

  return (
    <View style={styles.container}>
      {communities.length !== 0 ? (
        <FlatList
          data={communities}
          keyExtractor={(item) => item.community_id.toString()}
          renderItem={({ item, index }) => (
            <View>
              <CommunityCard
                community_name={item.name}
                community_description={item.description}
                location={item.location}
                member_count={item.members.length}
                profile_photo_url={item.profile_photo_url}
                community_id={item.community_id}
              />
              {/*index !== communities.length - 1 && (
              <View style={enosiStyles.separator} />
            )*/}
            </View>
          )}
        />
      ) : (
        <BlankCommunitiesScreen />
      )}
      <FloatingButton />
    </View>
  );
};

const BlankCommunitiesScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.blankContainer}>
      <Text style={styles.text}>No communites yet.</Text>
      <Text style={styles.subText}>
        Join communities using the explore tab!
      </Text>
      <Button
        title="Find Communities & Friends"
        onPress={() => navigation.navigate("Explore")} // Replace 'SearchScreen' with the actual route name
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  blankContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default CommunitiesList;
