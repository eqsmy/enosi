export async function fetchProfile(supabase, user_id) {
  let { data, error } = await supabase
    .from("view_user_profile")
    .select("*")
    .eq("user_id", user_id)
    .single();
  if (error) {
    return { error: error, data: null };
  }
  if (data) {
    return { data: data, error: null };
  }
}

export async function insertFriend(supabase, user_id, friend_user_id) {
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
    console.log("Error adding friend");
    return { error: error, data: null };
  }

  if (data) {
    console.log("Friend added");
    const refreshedProfile = await fetchProfile(supabase, friend_user_id);
    return refreshedProfile;
  }
}

export async function removeFriend(supabase, user_id, friend_user_id) {
  const { data, error } = await supabase
    .from("user_friends")
    .delete()
    .eq("user_id", user_id)
    .eq("friend_user_id", friend_user_id)
    .select();
  if (error) {
    console.log("Error removing friend");
    return { error: error, data: null };
  }

  if (data) {
    console.log("Friend removed");
    const refreshedProfile = await fetchProfile(supabase, friend_user_id);
    return refreshedProfile;
  }
}

export async function insertChallenge(
  supabase,
  community_id,
  master_challenge
) {
  console.log("master", master_challenge);
  const { data, error } = await supabase
    .from("challenges_community")
    .insert([
      {
        community_id: community_id,
        challenge_master_id: master_challenge.id,
        start_date: new Date(),
        end_date: new Date(
          new Date().getTime() + master_challenge.duration * 24 * 60 * 60 * 1000
        ),
        current_total: 0,
        status: "active",
        goal_total: master_challenge.goal_total,
        challenge_name: master_challenge.name,
        challenge_description: master_challenge.description,
        unit: master_challenge.unit,
      },
    ])
    .select();
  if (error) {
    console.log("Error adding challenge");
    return { error: error, data: null };
  }

  if (data) {
    console.log("Challenge added");
    return { data: data, error: null };
  }
}
