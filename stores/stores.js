import { create } from "zustand";

/**
 * useCommunitiesStore
 *
 * This store is used for managing a user's communities.
 * - communities - all communities the user is a member of
 * - fetchCommunitiesView - fetches the list of communities for the user
 * - insertCommunity - ability to create a new community
 */
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

  insertCommunity: async (
    supabase,
    user_id,
    name,
    description,
    header_photo_url,
    profile_photo_url
  ) => {
    const { data, error } = await supabase
      .from("tristan_user_communities")
      .insert([
        { user_id, name, description, header_photo_url, profile_photo_url },
      ])
      .select()
      .single();
    if (error) {
      console.log("Error creating community", error);
    }
    if (data) {
      // data.id should be the new community id
      // TODO: insert the user as an admin of the community
      fetchCommunitiesView(supabase, user_id);
    }
  },
}));

/**
 * useUserActivityStore
 *
 * This store is used for managing a user's activity.
 * - userContributions - list of contributions the user has made
 * - userPosts - list of posts the user has made
 * - insertUserContribution - adds a contribution to the user's list
 * - fetchUserContributions - fetches the list of contributions for the user
 * - insertCommunityPost - adds a post to the user's list
 * - fetchUsersCommunityPosts - fetches the list of posts for the user
 */
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

export const useFeedStore = create()((set, get) => ({
  feed: [],
  activeChallenges: [],

  fetchFeed: async (supabase, user_id) => {
    let { data, error } = await supabase
      .from("view_user_feed")
      .select("*")
      .eq("user_id", user_id)
      .single();
    if (error) {
      console.log("Error fetching feed", error);
    }
    if (data) {
      set({ feed: prepareFeed(data) });
    }
  },

  fetchActiveChallenges: async (supabase, user_id) => {
    let { data, error } = await supabase
      .from("view_user_active_challenges")
      .select("*")
      .eq("user_id", user_id)
      .single();
    if (error) {
      console.log("Error fetching active challenges", error);
    }
    if (data) {
      set({ activeChallenges: data.active_challenges });
    }
  },
}));

function prepareFeed(rawFeed) {
  const feedItems = rawFeed.feed.map((item) => ({
    ...item,
    type: "feed", // Add type key
  }));
  const contributionItems = rawFeed.contributions.map((item) => ({
    ...item,
    type: "contribution", // Add type key
  }));

  // Merge the arrays
  const mergedItems = [...feedItems, ...contributionItems];

  // Sort by created_at, most recent first
  mergedItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return mergedItems;
}

export const useChallengeStore = create()((set, get) => ({
  challengeDetail: null,
  loading: true,
  
  fetchChallengeDetail: async (supabase, challenge_id) => {
    set({ loading: true });
    let { data, error } = await supabase
      .from("view_active_challenge_details")
      .select("*")
      .eq("challenge_id", challenge_id)
      .single();
    if (error) {
      console.log("Error fetching challenge", error);
    }
    if (data) {
      console.log("challengeDetail", data);
      set({ challengeDetail: data, loading: false });
    }
  },
}));
