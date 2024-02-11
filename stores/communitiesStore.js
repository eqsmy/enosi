import { create } from "zustand";

// supabase: SupabaseClient
export const useCommunitiesStore = create()((set, get) => ({
  communities: [],

  fetchCommunitiesView: async (supabase, user_id) => {
    let { data, error } = await supabase
      .from("view_user_communities")
      .select("*")
      .eq("user_id", user_id)
      .single();
    if (error) {
      console.log("Error fetching communities", error);
    }
    if (data) {
      set({ communities: data.communities });
    }
  },
}));

export const useUserActivityStore = create()((set, get) => ({
  userContributions: [],
  userPosts: [],

  insertUserContribution: async (
    supabase,
    user_id,
    community_challenge_id,
    contribution,
    unit,
    image_url,
    comment
  ) => {
    const { data, error } = await supabase
      .from("tristan_user_challenge_contributions")
      .insert([
        {
          user_id,
          community_challenge_id,
          contribution,
          unit,
          image_url,
          comment,
        },
      ])
      .select();
    if (error) {
      console.log("Error inserting challenge log", error);
    }
    if (data) {
      // fetchUserLogs(supabase, user_id);
    }
  },

  fetchUserContributions: async (supabase, user_id) => {
    let { data, error } = await supabase

      .from("tristan_user_challenge_contributions")
      .select("*")
      .eq("user_id", user_id);
    if (error) {
      console.log("Error fetching user's contributions", error);
    }
    if (data) {
      set({ userContributions: data });
    }
  },

  insertCommunityPost: async (
    supabase,
    user_id,
    community_id,
    comment,
    image_url
  ) => {
    const { data, error } = await supabase
      .from("tristan_community_feeds")
      .insert([{ user_id, community_id, comment, image_url }])
      .select();
    if (error) {
      console.log("Error inserting community post", error);
    }

    // if (data) {
    //   fetchCommunityPosts(supabase, community_id);
    // }
  },

  fetchUsersCommunityPosts: async (supabase, user_id) => {
    let { data, error } = await supabase
      .from("tristan_community_feeds")
      .select("*")
      .eq("user_id", user_id);
    if (error) {
      console.log("Error fetching user's community posts", error);
    }
    if (data) {
      set({ userPosts: data });
    }
  },
}));

/**
 * useFriendsStore
 *
 * This store is used for managing a user's friends.
 * - friends - list of friends
 * - fetchFriendsView - fetches the list of friends for the user
 * - insertFriend - adds a friend to the user's list
 * - removeFriend - removes a friend from the user's list
 */
export const useFriendStore = create()((set, get) => ({
  friends: [],

  fetchFriendsView: async (supabase, user_id) => {
    let { data, error } = await supabase
      .from("view_user_friends_list")
      .select("*")
      .eq("user_id", user_id)
      .single();
    if (error) {
      console.log("Error fetching friends list", error);
    }
    if (data) {
      set({ friends: data.friends });
    }
  },

  insertFriend: async (supabase, user_id, friend_id) => {
    const { data, error } = await supabase
      .from("tristan_user_friends")
      .insert([{ user_id, friend_id }])
      .select();
    if (error) {
      console.log("Error inserting friend", error);
    }
    if (data) {
      fetchFriendsView(supabase, user_id);
    }
  },

  removeFriend: async (supabase, user_id, friend_id) => {
    const { data, error } = await supabase
      .from("tristan_user_friends")
      .delete()
      .eq("user_id", user_id)
      .eq("friend_id", friend_id);
    if (error) {
      console.log("Error removing friend", error);
    }
    if (data) {
      fetchFriendsView(supabase, user_id);
    }
  },
}));