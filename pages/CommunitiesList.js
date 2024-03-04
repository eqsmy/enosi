import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import CommunityCard from "../components/CommunityCard";
import { supabase } from "../utils/Supabase";
import FloatingButton from "../components/FloatingButton";
import { COLORS, FONTS } from "../constants";
import { useCommunitiesStore, useCommunityDetailStore } from "../stores/stores";
import { enosiStyles } from "./styles";

const CommunitiesList = () => {
  const { communities } = useCommunitiesStore();
  return (
    <View style={styles.container}>
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
      <FloatingButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
});

export default CommunitiesList;
