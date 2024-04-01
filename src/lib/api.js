import supabase from "./supabaseConfig";
import { determineDateRange } from "../utils/dateutils";

// export const signUp = async (email, password) => {
// 	if (!email || !password) {
// 		throw new Error("Email and password are required.");
// 	}

// 	try {
// 		const { user, error } = await supabase.auth.signUp({ email, password });
// 		if (error) throw new Error(error.message || "Error during signup");
// 		console.log("Signup successful:", user);
// 		return user;
// 	} catch (error) {
// 		console.error("Signup process error:", error);
// 		throw error;
// 	}
// };

export const updateUserDetails = async (
  username,
  pronouns,
  avatar,
  alternate_avatar
) => {
  try {
    const { data, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    if (data && data.user) {
      const user = data.user;
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
    } else {
      throw new Error("No user logged in.");
    }
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
};

// export const signIn = async (email, password) => {
// 	if (!email || !password) {
// 		throw new Error("Email and password are required.");
// 	}

// 	try {
// 		const { user, error } = await supabase.auth.signInWithPassword({ email, password });
// 		if (error) throw new Error(error.message || "Error during sign-in");
// 		return user;
// 	} catch (error) {
// 		console.error("Error signing in:", error);
// 		throw error;
// 	}
// };

export const createNewHousehold = async (
  householdName,
  sizeInSqm,
  numberOfRooms
) => {
  try {
    const userId = supabase.auth.user().id; // Assuming you can get the current user's ID this way
    if (!userId) {
      throw new Error("User must be logged in to create a household.");
    }

    // Check if the user is already part of a household
    const { data: userCurrentHousehold, error: userHouseholdError } =
      await supabase
        .from("user_details")
        .select("household_id")
        .eq("user_id", userId)
        .single();

    if (userHouseholdError) {
      throw new Error("Failed to check current household for user.");
    }

    if (userCurrentHousehold && userCurrentHousehold.household_id) {
      throw new Error("User is already part of a household.");
    }

    // Proceed with creating a new household
    const { data: newHousehold, error: newHouseholdError } = await supabase
      .from("household_details")
      .insert([
        {
          household_name: householdName,
          size_in_sqm: sizeInSqm,
          number_of_rooms: numberOfRooms,
        },
      ])
      .single();

    if (newHouseholdError) {
      throw new Error("Failed to create new household.");
    }

    await updateHouseholdData();

    // Link the user to the newly created household
    const { error: linkError } = await supabase
      .from("user_details")
      .update({ household_id: newHousehold.household_id })
      .eq("user_id", userId);

    if (linkError) {
      throw new Error("Failed to link user to the new household.");
    }

    // Update session storage to reflect new household membership
    await updateHouseholdData();
    console.log(
      "Household created and user linked successfully:",
      newHousehold
    );
    return { success: true, household_id: newHousehold.household_id };
  } catch (error) {
    console.error("Error creating and linking new household:", error);
    return { success: false, error: error.message };
  }
};

export const validateInvitationToken = async (token) => {
  const response = await fetch("/api/validate-invitation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error("Failed to validate invitation");
  }

  return response.json();
};

export const joinHouseholdUsingToken = async (token) => {
  try {
    // Fetch invitation details
    const { data: invitation, error } = await supabase
      .from("household_invitations")
      .select("*")
      .eq("token", token)
      .single();

    if (
      error ||
      !invitation ||
      invitation.used ||
      new Date() > new Date(invitation.expires_at)
    ) {
      throw new Error("Invalid or expired invitation.");
    }

    const userId = supabase.auth.getUser().id;
    if (!userId)
      throw new Error("User must be logged in to accept an invitation.");

    // Mark the invitation as used and link the user to the household
    await supabase
      .from("household_invitations")
      .update({ used: true })
      .eq("id", invitation.id);
    await supabase
      .from("user_details")
      .update({ household_id: invitation.household_id })
      .eq("user_id", userId);

    // Update session storage with new household details
    await updateHouseholdDataInCompleteUser();
    console.log("Invitation accepted successfully.");
  } catch (error) {
    console.error("Error joining household using token:", error.message);
  }
};

export const linkUserToHousehold = async (
  householdName,
  sizeInSqm,
  numberOfRooms,
  joinExisting
) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const user = userData.user;
    if (!user) throw new Error("No user logged in.");

    let householdId;

    console.log("Current user ID:", user.id);

    if (joinExisting) {
      // Join an existing household
      const { data: households, error: householdError } = await supabase
        .from("household_details")
        .select("household_id")
        .eq("household_name", householdName);

      if (householdError) throw householdError;
      if (!households || households.length === 0)
        throw new Error("Household does not exist.");

      householdId = households[0].household_id;
    } else {
      // Create a new household
      const createdHousehold = await createNewHousehold(
        householdName,
        sizeInSqm,
        numberOfRooms
      );
      householdId = createdHousehold.household_id;
    }

    // Link the user to the household
    const { error: linkError } = await supabase
      .from("user_details")
      .update({ household_id: householdId })
      .eq("user_id", user.id);

    if (linkError) throw linkError;

    console.log(
      "User linked to household successfully. Household ID:",
      householdId
    );
    return { household_id: householdId };
  } catch (error) {
    console.error("Error in linkUserToHousehold function:", error);
    throw error;
  }
};

export const joinExistingHousehold = async (householdName) => {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const user = userData.user;
    if (!user) throw new Error("No user logged in.");

    // Check if the household exists
    let { data: households, error: householdError } = await supabase
      .from("household_details")
      .select("household_id")
      .eq("household_name", householdName);

    if (householdError) throw householdError;
    if (!households || households.length === 0) {
      throw new Error("Household does not exist.");
    }

    const householdId = households[0].household_id;

    const { data: householdMembers, error: membersError } = await supabase
      .from("user_details")
      .select("username")
      .eq("household_id", householdId);

    if (membersError) throw membersError;

    if (householdMembers.length > 0) {
      const memberNames = householdMembers
        .map((member) => member.username)
        .join(", ");
      return {
        exists: true,
        hasMembers: true,
        memberNames: memberNames,
      };
    }

    // Link the user to household
    const { error: linkError } = await supabase
      .from("user_details")
      .update({ household_id: householdId })
      .eq("user_id", user.id);

    if (linkError) throw linkError;

    console.log("User joined household successfully.");
    return {
      exists: true,
      hasMembers: false,
      memberNames: "",
    };
  } catch (error) {
    console.error("Error in joinExistingHousehold function:", error);
    throw error;
  }
};

export const updateChoreDataInCompleteUser = async () => {
  const completeUser = JSON.parse(sessionStorage.getItem("completeUser"));
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

  if (choresError) {
    console.error("Error fetching user chores:", choresError);
    return;
  }

  completeUser.chores = userChores;

  sessionStorage.setItem("completeUser", JSON.stringify(completeUser));
};

export const updateHouseholdDataInCompleteUser = async () => {
  const sessionData = sessionStorage.getItem("completeUser");
  if (!sessionData) {
    console.error("Complete user data not found in session storage.");
    return;
  }

  const completeUser = JSON.parse(sessionData);
  const userId = completeUser.authUserId;

  try {
    // Fetch updated user details to get the latest household ID
    const { data: userDetails, error: userDetailsError } = await supabase
      .from("user_details")
      .select("household_id")
      .eq("user_id", userId)
      .single();

    if (userDetailsError || !userDetails)
      throw new Error("User details fetch failed.");

    const { data: householdDetails, error: householdDetailsError } =
      await supabase
        .from("household_details")
        .select("*")
        .eq("household_id", userDetails.household_id)
        .single();

    if (householdDetailsError || !householdDetails)
      throw new Error("Household details fetch failed.");
    // Fetch updated list of users in the household excluding the current user
    const { data: otherUsers, error: otherUsersError } = await supabase
      .from("user_details")
      .select("username, pronouns, avatar, alternate_avatar")
      .eq("household_id", completeUser.household.id)
      .neq("user_id", completeUser.authUserId);

    if (otherUsersError) {
      throw new Error("Failed to fetch household members");
    }

    // Update the completeUser object with new household details and user list
    completeUser.household = {
      ...completeUser.household,
      id: householdDetails.household_id,
      name: householdDetails.household_name,
      numberOfRooms: householdDetails.number_of_rooms,
      sizeInSqm: householdDetails.size_in_sqm,
      users: otherUsers,
    };

    // Save the updated completeUser back to session storage
    sessionStorage.setItem("completeUser", JSON.stringify(completeUser));
    console.log("Household data updated in session storage.");
  } catch (error) {
    console.error(
      "Error updating household data in complete user:",
      error.message
    );
  }
};

export const getCompleteUser = async () => {
  try {
    const sessionData = sessionStorage.getItem("completeUser");
    if (sessionData) {
      return JSON.parse(sessionData);
    }

    // Current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const user = userData.user;
    if (!user) throw new Error("No user logged in.");

    // Get user details from "user_details"
    const { data: userDetails, error: userDetailsError } = await supabase
      .from("user_details")
      .select("id, username, pronouns, avatar, alternate_avatar, household_id")
      .eq("user_id", user.id)
      .single();

    if (userDetailsError) throw userDetailsError;

    let householdDetails = null;
    if (userDetails && userDetails.household_id) {
      // Get household details
      const { data: fetchedHouseholdDetails, error: householdDetailsError } =
        await supabase
          .from("household_details")
          .select("household_name, number_of_rooms, size_in_sqm")
          .eq("household_id", userDetails.household_id)
          .single();

      if (householdDetailsError) throw householdDetailsError;
      householdDetails = fetchedHouseholdDetails;
    }

    // other users in the same household
    let otherUsers = [];
    if (userDetails && userDetails.household_id) {
      const { data: fetchedOtherUsers, error: otherUsersError } = await supabase
        .from("user_details")
        .select("username, pronouns, avatar, alternate_avatar")
        .eq("household_id", userDetails.household_id)
        .neq("user_id", user.id);

      if (otherUsersError) throw otherUsersError;
      otherUsers = fetchedOtherUsers;
    }

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
      .eq("user_detail_id", userDetails.id);

    if (choresError) {
      console.error("Error fetching user chores:", choresError);
      throw new Error(choresError.message || "Error fetching user chores.");
    }

    // Create a complete user
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
        name: householdDetails ? householdDetails.household_name : "",
        numberOfRooms: householdDetails ? householdDetails.number_of_rooms : 0,
        sizeInSqm: householdDetails ? householdDetails.size_in_sqm : 0,
        users: otherUsers ? otherUsers : [],
      },
      chores: userChores,
    };

    console.log("complete user retrieved sucessfully:", completeUser);

    sessionStorage.setItem("completeUser", JSON.stringify(completeUser));

    console.log("complete user saved to session storage.");

    return completeUser;
  } catch (error) {
    console.error("Error getting complete user:", error);
    throw error;
  }
};

export const updateHouseholdData = async (userId) => {
  try {
    // Fetch fresh household ID and details from user_details
    const { data: userDetails, error: userDetailsError } = await supabase
      .from("user_details")
      .select("household_id")
      .eq("user_id", userId)
      .single();

    if (userDetailsError) throw userDetailsError;
    if (!userDetails.household_id) throw new Error("No household linked.");

    // Fetch fresh household details
    const { data: householdDetails, error: householdDetailsError } = await supabase
      .from("household_details")
      .select("*")
      .eq("household_id", userDetails.household_id)
      .single();

    if (householdDetailsError) throw householdDetailsError;

    // Optionally, fetch other users in the same household
    const { data: otherUsers, error: otherUsersError } = await supabase
      .from("user_details")
      .select("id, username, pronouns, avatar, alternate_avatar")
      .eq("household_id", userDetails.household_id)
      .neq("user_id", userId);

    if (otherUsersError) throw otherUsersError;

    // Update the completeUser object in session storage
    const completeUser = JSON.parse(sessionStorage.getItem("completeUser"));
    completeUser.household = {
      ...completeUser.household,
      id: userDetails.household_id,
      details: householdDetails,
      users: otherUsers
    };
    sessionStorage.setItem("completeUser", JSON.stringify(completeUser));

    console.log("Household data updated successfully.");
  } catch (error) {
    console.error("Error updating household data:", error.message);
  }
};

export const updateUserChores = async (userDetailsId) => {
  try {
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
      .eq("user_detail_id", userDetailsId);

    if (choresError) {
      throw new Error(choresError.message || "Error fetching user chores.");
    }

    const completeUser = JSON.parse(sessionStorage.getItem("completeUser"));
    completeUser.chores = userChores;
    sessionStorage.setItem("completeUser", JSON.stringify(completeUser));

    console.log("User chores updated successfully.");
  } catch (error) {
    console.error("Error updating user chores:", error);
    throw error;
  }
};

export const logChore = async (subcategory_id, duration_in_sessions) => {
  try {
    // Get the current user ID
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const authUserId = userData.user.id;

    const { data: userDetails, error: userDetailsError } = await supabase
      .from("user_details")
      .select("id")
      .eq("user_id", authUserId)
      .single();

    if (userDetailsError) {
      console.error("Error fetching user details:", userDetailsError);
      throw new Error(
        userDetailsError.message || "Error fetching user details."
      );
    }

    // Insert the chore log
    const { error: insertError } = await supabase.from("chore_log").insert([
      {
        user_detail_id: userDetails.id,
        subcategory_id: subcategory_id,
        duration_in_sessions: duration_in_sessions,
      },
    ]);

    if (insertError) {
      console.error("Error logging chore:", insertError);
      throw new Error("Failed to log chore.");
    }

    updateChoreDataInCompleteUser();

    console.log("Chore logged successfully.");
  } catch (error) {
    console.error("Error in logChore function:", error);
    throw error;
  }
};

export const fetchChoreCategories = async () => {
  try {
    const { data: categories, error: categoriesError } = await supabase.from(
      "chore_categories"
    ).select(`
                category_id,
                category_name,
                chore_subcategories (subcategory_id, subcategory_name)
            `);

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      throw new Error(categoriesError.message || "Error fetching categories.");
    }

    return categories;
  } catch (error) {
    console.error("Error in fetchChoreCategories function:", error);
    throw error;
  }
};

export const getUserChoreOverview = async (userDetailId, filter) => {
  try {
    const userDetailIdInt = parseInt(userDetailId, 10);
    if (isNaN(userDetailIdInt)) {
      throw new Error("Invalid user detail ID");
    }

    // Format dates for Supabase
    const [formattedStartDate, formattedEndDate] = determineDateRange(filter);

    // Calling procedure with date filters
    const { data: filteredData, error } = await supabase.rpc(
      "get_user_chore_overview_filtered",
      {
        user_detail_id_param: userDetailIdInt,
        start_date_param: formattedStartDate,
        end_date_param: formattedEndDate,
      }
    );

    if (error) {
      throw error;
    }

    // Fetch category names
    const { data: categories, error: categoriesError } = await supabase
      .from("chore_categories")
      .select("category_id, category_name");
    if (categoriesError) throw categoriesError;

    // Merge category names and filtered data
    const overviewData = categories.map((category) => {
      const filteredCategory = filteredData.find(
        (data) => data.category_id === category.category_id
      );
      return {
        category_name: category.category_name,
        category_id: category.category_id,
        total_minutes: filteredCategory ? filteredCategory.total_minutes : 0,
        total_monetary_value: filteredCategory
          ? parseFloat(filteredCategory.total_monetary_value)
          : 0,
      };
    });

    return overviewData;
  } catch (error) {
    console.error("Error in getUserChoreOverview function:", error);
    throw error;
  }
};

function ldetermineDateRange(filter) {
  //TODO: There must be a better way to do this(?)
  const now = new Date();
  let startDate, endDate;

  switch (filter) {
    case "day":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
      );
      break;
    case "week":
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now.getFullYear(), now.getMonth(), diff);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      console.log(
        `Filter: ${filter}, Start Date: ${startDate}, End Date: ${endDate}`
      );
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    case "all":
      startDate = null;
      endDate = null;
      break;
    default:
      throw new Error("Invalid filter option");
  }

  const formattedStartDate = startDate ? startDate.toISOString() : null;
  const formattedEndDate = endDate ? endDate.toISOString() : null;

  return [formattedStartDate, formattedEndDate];
}

export const getHouseholdChoreOverview = async () => {
  try {
    // Current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const user = userData.user;
    if (!user) throw new Error("No user logged in.");

    // Get user details from "user_details"
    const { data: userDetails, error: userDetailsError } = await supabase
      .from("user_details")
      .select("id, household_id")
      .eq("user_id", user.id)
      .single();

    if (userDetailsError) throw userDetailsError;

    const householdId = userDetails.household_id;
    if (!householdId) {
      throw new Error("User is not linked to a household.");
    }

    // Fetch household members
    const { data: members, error: membersError } = await supabase
      .from("user_details")
      .select("id, username, avatar")
      .eq("household_id", householdId);
    if (membersError) throw membersError;

    // Fetch chores for each household member
    for (const member of members) {
      const { data: chores, error: choresError } = await supabase
        .from("chore_log")
        .select("total_minutes, total_monetary_value")
        .eq("user_detail_id", member.id);
      if (choresError) throw choresError;

      // Aggregate data
      member.totalMinutes = chores.reduce(
        (acc, chore) => acc + chore.total_minutes,
        0
      );
      member.totalValue = chores.reduce(
        (acc, chore) => acc + chore.total_monetary_value,
        0
      );
    }

    return members;
  } catch (error) {
    console.error("Error in getHouseholdChoreOverview function:", error);
    throw error;
  }
};

export const getHouseholdChoreOverviewForDoubleBar = async () => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    const user = userData.user;
    if (!user) throw new Error("No user logged in.");

    const { data: userDetails, error: userDetailsError } = await supabase
      .from("user_details")
      .select("id, household_id")
      .eq("user_id", user.id)
      .single();

    if (userDetailsError) throw userDetailsError;

    const householdId = userDetails.household_id;
    if (!householdId) throw new Error("User is not linked to a household.");

    const { data: members, error: membersError } = await supabase
      .from("user_details")
      .select("id, username, avatar")
      .eq("household_id", householdId);
    if (membersError) throw membersError;

    if (members.length !== 2)
      throw new Error("Household does not have exactly two members.");

    const { data: categoriesData, error: categoriesDataError } = await supabase
      .from("chore_categories")
      .select("category_id, category_name");
    if (categoriesDataError) throw categoriesDataError;

    const memberData = await Promise.all(
      members.map(async (member) => {
        const { data: chores, error: choresError } = await supabase
          .from("chore_log")
          .select("category_id, total_minutes")
          .eq("user_detail_id", member.id);
        if (choresError) throw choresError;

        // Calculate total minutes for household member
        const totalMinutes = chores.reduce(
          (acc, chore) => acc + chore.total_minutes,
          0
        );

        // Map category IDs to names, calculate %
        const categories = categoriesData.map((category) => {
          const totalCategoryMinutes = chores
            .filter((c) => c.category_id === category.category_id)
            .reduce((acc, chore) => acc + chore.total_minutes, 0);
          const percentage =
            totalMinutes > 0 ? (totalCategoryMinutes / totalMinutes) * 100 : 0;
          return {
            category: category.category_name,
            percentage: parseFloat(percentage.toFixed(2)),
          };
        });

        return {
          username: member.username,
          categories: categories,
        };
      })
    );

    return memberData;
  } catch (error) {
    console.error(
      "Error in getHouseholdChoreOverviewForDoubleBar function:",
      error
    );
    throw error;
  }
};

// export const signOut = async () => {
// 	try {
// 		const { error } = await supabase.auth.signOut();
// 		if (error) throw error;
// 		console.log("Sign out successful");
// 	} catch (error) {
// 		console.error("Error signing out:", error);
// 	}
// };
