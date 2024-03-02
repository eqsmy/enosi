import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import CommunityCard from "../components/CommunityCard";
import { supabase } from "../utils/Supabase";
import { COLORS, FONTS } from "../constants";

const CommunitiesList = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from("view_community_details")
        .select("*");
      if (error) throw error;
      setCommunities(data);
    } catch (error) {
      console.error(
        "Error fetching communities with member count:",
        error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={communities}
        keyExtractor={(item) => item.community_id.toString()}
        renderItem={({ item }) => (
          <CommunityCard
            community_name={item.community_name}
            community_description={item.community_description}
            location={item.location}
            members={item.member_count}
            profile_photo_url={item.profile_photo_url}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default CommunitiesList;
