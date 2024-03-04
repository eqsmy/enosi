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
    is_public,
    location,
    description,
    header_photo_url,
    profile_photo_url
  ) => {
    //step 1: create the new community and insert it into the communities table
    const { data: communityData, error: communityError } = await supabase
      .from("communities")
      .insert([
        {
          name,
          is_public,
          location,
          description,
          header_photo_url,
          profile_photo_url,
        },
      ])
      .select("id");
    console.log(communityData);
    if (communityError) {
      console.log("Error creating community", communityError);
      throw new Error(communityError.message);
      return; // exit early if there is an error
    } else if (!communityData) {
      throw new Error("Failed to create community, no data returned.");
    }
    //assuming the community is successfully created, proceed to add membership
    const communityId = communityData[0].id;

    //now add the user as the admin of the community
    const { error: membershipError } = await supabase
      .from("community_membership")
      .insert([
        {
          user_id,
          community_id: communityId,
          role: "admin",
          joined_at: new Date().toISOString(),
        },
      ]);
    if (membershipError) {
      //console.error("Error adding community membership", membershipError);
      throw new Error(communityError.message);
    } else {
      //console.log("Community and membership created successfully!");
      get().fetchCommunitiesView(supabase, user_id);
      return communityId;
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
      .from("user_challenge_contributions")
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

      .from("user_challenge_contributions")
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
      .from("user_posts")
      .insert([{ user_id, community_id, comment, image_url }])
      .select();
    if (error) {
      console.log("Error inserting community post", error);
    }
  },

  fetchUsersCommunityPosts: async (supabase, user_id) => {
    let { data, error } = await supabase
      .from("user_posts")
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
  loading: true,
  friends: [],
  fetchFriendsView: async (supabase, user_id) => {
    let { data, error } = await supabase
      .from("view_user_friends_list")
      .select("*")
      .eq("user_id", user_id)
      .single();
    if (error) {
      console.log("Error fetching friends list", error);
      return { error: error, data: null };
    }
    if (data) {
      return { error: null, data: data };
    }
  },

  fetchProfile: async (supabase, user_id) => {
    set({ loading: true });
    let { data, error } = await supabase
      .from("view_user_profile")
      .select("*")
      .eq("user_id", user_id)
      .single();
    if (error) {
      console.log("Error fetching profile", error);
      set({ loading: false });
      return { error: error, data: null };
    }
    if (data) {
      console.log("fetchProfile success", data);
      set({ loading: false });
      return { data: data, error: null };
    }
  },

  insertFriend: async (supabase, user_id, friend_user_id) => {
    const { data, error } = await supabase
      .from("user_friends")
      .insert([
        {
          user_id: user_id,
          friend_user_id: friend_user_id,
          status: "accepted",
        },
      ])
      .select();
    if (error) {
      console.log("Error adding friend", error);
      return { error: error, data: null };
    }

    if (data) {
      console.log("Friend added", data);
      const refreshedProfile = await fetchProfile(supabase, user_id);
      console.log("refreshedProfile", refreshedProfile);
      return refreshedProfile;
    }
  },

  removeFriend: async (supabase, user_id, friend_id) => {
    const { data, error } = await supabase
      .from("user_friends")
      .delete()
      .eq("user_id", user_id)
      .eq("friend_user_id", friend_id)
      .select();
    if (error) {
      console.log("Error removing friend", error);
      return { error: error, data: null };
    }

    if (data) {
      console.log("Friend removed", data);
      // return data;
      const refreshedProfile = await fetchProfile(supabase, user_id);
      console.log("refreshedProfile", refreshedProfile);
      return refreshedProfile;
    }
  },
}));

export const useFeedStore = create()((set, get) => ({
  feed: [],
  activeChallenges: [],
  exploreFeed: [],
  communitiesSearchList: [],

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

  fetchExploreFeed: async (supabase, user_id) => {
    let { data, error } = await supabase
      .from("view_explore_page")
      .select("*")
      .eq("user_id", user_id)
      .single();
    if (error) {
      console.log("Error fetching feed", error);
    }
    if (data) {
      set({
        exploreFeed: prepareExploreFeed(data),
        communitiesSearchList: data.explore_communities,
      });
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

function prepareExploreFeed(rawFeed) {
  const communityItems = rawFeed.explore_communities?.map((item) => ({
    ...item,
    type: "community", // Add type key
  }));
  const challengeItems = rawFeed.explore_challenges.map((item) => ({
    ...item,
    type: "challenge", // Add type key
  }));
  const mergedItems = [...communityItems, ...challengeItems];

  // Sort by created_at, most recent first
  mergedItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return mergedItems;
}

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
      .from("view_challenge_details")
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

export const useCommunityDetailStore = create()((set, get) => ({
  communityDetail: null,
  loading: true,
  isMember: false,
  communityDetailFeed: [],

  fetchCommunityDetail: async (supabase, community_id, user_id) => {
    //set({ loading: true });
    let { data, error } = await supabase
      .from("view_community_details")
      .select("*")
      .eq("community_id", community_id)
      .single();
    if (error) {
      console.log("Error fetching community", error);
    }
    if (data) {
      set({
        communityDetail: data,
        loading: false,
        isMember:
          data.members?.some((value) => value.member_id == user_id) ?? false,
        communityDetailFeed: prepareFeedData(data.contributions, data.feeds),
      });
    }
  },

  toggleJoin: async (supabase, user_id, community_id) => {
    supabase
      .from("community_membership")
      .select("*")
      .eq("user_id", user_id)
      .eq("community_id", community_id)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error checking existing row:", error.message);
          return;
        }

        if (data.length > 0) {
          // Row already exists, delete it
          supabase
            .from("community_membership")
            .delete()
            .eq("user_id", user_id)
            .eq("community_id", community_id)
            .then(({ error }) => {
              if (error) {
                console.error("Error deleting existing row:", error.message);
                return;
              }
              console.log("Existing row deleted.");
              get().fetchCommunityDetail(supabase, community_id, user_id);
            });
        } else {
          // Row doesn't exist, insert it
          supabase
            .from("community_membership")
            .upsert({ user_id, community_id, role: "member" })
            .then(({ error }) => {
              if (error) {
                console.error("Error inserting row:", error.message);
                return;
              }
              console.log("Community joined.");
              get().fetchCommunityDetail(supabase, community_id, user_id);
            });
        }
      });
  },
}));

export function prepareFeedData(contributions, feed) {
  let feedItems = [];
  if (feed) {
    feedItems = feed.map((item) => ({
      ...item,
      type: "feed", // Add type key
    }));
  }
  let contributionItems = [];
  if (contributions) {
    contributionItems = contributions.map((item) => ({
      ...item,
      type: "contribution", // Add type key
    }));
  }

  // Merge the arrays
  const mergedItems = [...feedItems, ...contributionItems];

  // Sort by created_at, most recent first
  mergedItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return mergedItems;
}
