import {
  apiRequest,
  getUser,
  saveToSessionStorage,
  getFromSessionStorage,
} from "./baseApiService";

import supabase from "../supabaseConfig";

export const getCompleteUser = async () => {
  console.log("getCompleteUser: Starting");

  return await apiRequest(async () => {
    let sessionData = getFromSessionStorage("completeUser");
    if (sessionData) {
      console.log("getCompleteUser: Found in session storage", sessionData);
      return sessionData;
    }

    const user = await getUser();
    if (!user) {
      console.error("getCompleteUser: No user logged in.");
      return null;
    }

    const { data: userDetails, error: userDetailsError } = await supabase
      .from("user_details")
      .select("id, username, pronouns, avatar, alternate_avatar, household_id")
      .eq("user_id", user.id)
      .single();
    if (userDetailsError) throw userDetailsError;

    console.log("getCompleteUser: Fetched user details from Supabase");

    const chores = await supabase
      .from("chore_log")
      .select("*")
      .eq("user_detail_id", userDetails.id);
    if (chores.error) throw chores.error;

    console.log("getCompleteUser: Fetched chores from Supabase");

    const completeUser = {
      authUserId: user.id,
      userDetailsId: userDetails.id,
      email: user.email,
      username: userDetails.username,
      pronouns: userDetails.pronouns,
      avatar: userDetails.avatar,
      alternateAvatar: userDetails.alternate_avatar,
      household: {
        id: userDetails.household_id,
        users: [],
      },
      chores: chores.data,
    };

    saveToSessionStorage("completeUser", completeUser);
    console.log("getCompleteUser: Saved to session storage", completeUser);
    return completeUser;
  });
};

export const updateUserDetails = async (
  username,
  pronouns,
  avatar,
  alternate_avatar
) => {
  return await apiRequest(async () => {
    const user = await getUser();
    if (!user) throw new Error("No user logged in.");

    const { error: updateError } = await supabase
      .from("user_details")
      .insert(
        [{ user_id: user.id, username, pronouns, avatar, alternate_avatar }],
        {
          upsert: true,
        }
      );
    if (updateError) throw updateError;

    console.log("User details updated successfully.");
  });
};

export const updateChoreDataInCompleteUser = async () => {
  return await apiRequest(async () => {
    const completeUser = getFromSessionStorage("completeUser");
    if (!completeUser) return;

    const { data: userChores, error: choresError } = await supabase
      .from("chore_log")
      .select(
        `
          log_id,
          subcategory_id,
          timestamp,
          duration_in_sessions,
          total_minutes,
          total_monetary_value,
          category_id
        `
      )
      .eq("user_detail_id", completeUser.userDetailsId);
    if (choresError)
      throw new Error(choresError.message || "Error fetching user chores.");

    completeUser.chores = userChores;
    saveToSessionStorage("completeUser", completeUser);
  });
};

export const updateHouseholdDataInCompleteUser = async () => {
  return await apiRequest(async () => {
    const completeUser = getFromSessionStorage("completeUser");
    if (!completeUser) return;

    const { data: userDetails, error: userDetailsError } = await supabase
      .from("user_details")
      .select("household_id")
      .eq("user_id", completeUser.authUserId)
      .single();
    if (userDetailsError) throw userDetailsError;

    const { data: householdDetails, error: householdDetailsError } =
      await supabase
        .from("household_details")
        .select("household_name, number_of_rooms, size_in_sqm")
        .eq("household_id", userDetails.household_id)
        .single();
    if (householdDetailsError) throw householdDetailsError;

    let otherUsers = [];
    if (userDetails && userDetails.household_id) {
      const { data: fetchedOtherUsers, error: otherUsersError } = await supabase
        .from("user_details")
        .select("username, pronouns, avatar, alternate_avatar")
        .eq("household_id", userDetails.household_id)
        .neq("user_id", completeUser.authUserId);
      if (otherUsersError) throw otherUsersError;
      otherUsers = fetchedOtherUsers;
    }

    completeUser.household = {
      ...completeUser.household,
      id: userDetails.household_id,
      name: householdDetails.household_name,
      numberOfRooms: householdDetails.number_of_rooms,
      sizeInSqm: householdDetails.size_in_sqm,
      users: otherUsers || [],
    };

    saveToSessionStorage("completeUser", completeUser);
  });
};
