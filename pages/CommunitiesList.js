import React, {useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, } from "react-native";
import CommunityCard from "../components/CommunityCard";
import {supabase } from "../utils/Supabase";
import { COLORS, FONTS } from "../constants";

const CommunitiesList = () => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from("community_with_member_count")
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CommunityCard
            photo={item.photo}
            name={item.name}
            about={item.about}
            members={item.num_members}
            location={item.location}
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
