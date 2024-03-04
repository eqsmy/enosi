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
