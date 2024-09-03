import {
  apiRequest,
  getUser,
  getFromSessionStorage,
  saveToSessionStorage,
} from "./baseApiService";
import supabase from "../supabaseConfig";
import { determineDateRange } from "../../utils/dateutils";

export const logChore = async (subcategory_id, duration_in_sessions) => {
  console.log("logChore: Starting");

  return await apiRequest(async () => {
    const user = await getUser();
    if (!user) throw new Error("No user logged in.");

    const { data: userDetails, error: userDetailsError } = await supabase
      .from("user_details")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (userDetailsError) throw userDetailsError;

    console.log("logChore: Fetched user details", userDetails);

    const { data: newChore, error: insertError } = await supabase
      .from("chore_log")
      .insert([
        {
          user_detail_id: userDetails.id,
          subcategory_id: subcategory_id,
          duration_in_sessions: duration_in_sessions,
        },
      ])
      .select()
      .single();
    if (insertError) throw new Error("Failed to log chore in the database.");

    console.log("logChore: Chore logged in database", newChore);

    const completeUser = getFromSessionStorage("completeUser");
    if (completeUser) {
      completeUser.chores.push(newChore);
      saveToSessionStorage("completeUser", completeUser);
      console.log(
        "logChore: Updated session storage with new chore",
        completeUser
      );
    } else {
      console.error("logChore: No completeUser found in session storage.");
    }

    return newChore;
  });
};

export const fetchChoreCategories = async () => {
  return await apiRequest(async () => {
    const { data: categories, error: categoriesError } = await supabase.from(
      "chore_categories"
    ).select(`
        category_id,
        category_name,
        chore_subcategories (subcategory_id, subcategory_name)
      `);
    if (categoriesError)
      throw new Error(categoriesError.message || "Error fetching categories.");

    return categories;
  });
};

export const getUserChoreOverview = async (userDetailId, filter) => {
  const cacheKey = `userChoreOverview_${userDetailId}_${filter}`;

  // Check if the data is already cached
  const cachedData = getFromSessionStorage(cacheKey);
  if (cachedData) {
    console.log(`Returning cached data for ${filter}`);
    return cachedData;
  }

  // If not cached, proceed with the database call
  return await apiRequest(async () => {
    const userDetailIdInt = parseInt(userDetailId, 10);
    if (isNaN(userDetailIdInt)) throw new Error("Invalid user detail ID");

    const [formattedStartDate, formattedEndDate] = determineDateRange(filter);

    const { data: filteredData, error } = await supabase.rpc(
      "get_user_chore_overview_filtered",
      {
        user_detail_id_param: userDetailIdInt,
        start_date_param: formattedStartDate,
        end_date_param: formattedEndDate,
      }
    );
    if (error) throw error;

    const { data: categories, error: categoriesError } = await supabase
      .from("chore_categories")
      .select("category_id, category_name");
    if (categoriesError) throw categoriesError;

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

    // Cache the result
    saveToSessionStorage(cacheKey, overviewData);

    return overviewData;
  });
};

export const getHouseholdChoreOverview = async (filter) => {
  return await apiRequest(async () => {
    const user = await getUser();
    if (!user) throw new Error("No user logged in.");

    const { data: userDetails, error: userDetailsError } = await supabase
      .from("user_details")
      .select("id, household_id")
      .eq("user_id", user.id)
      .single();
    if (userDetailsError) throw userDetailsError;

    const householdId = userDetails.household_id;
    if (!householdId) throw new Error("User is not linked to a household.");

    const [formattedStartDate, formattedEndDate] = determineDateRange(filter);

    const { data: members, error: membersError } = await supabase
      .from("user_details")
      .select("id, username, avatar, alternate_avatar")
      .eq("household_id", householdId);
    if (membersError) throw membersError;

    const { data: categories, error: categoriesError } = await supabase
      .from("chore_categories")
      .select("category_id, category_name");
    if (categoriesError) throw categoriesError;

    const membersWithChores = await Promise.all(
      members.map(async (member) => {
        let choresQuery = supabase
          .from("chore_log")
          .select("category_id, total_minutes, total_monetary_value")
          .eq("user_detail_id", member.id);

        if (formattedStartDate && formattedEndDate) {
          choresQuery = choresQuery
            .gte("timestamp", formattedStartDate)
            .lte("timestamp", formattedEndDate);
        }

        const { data: chores, error: choresError } = await choresQuery;
        if (choresError) throw choresError;

        const choresWithCategoryNames = chores.map((chore) => {
          const category = categories.find(
            (cat) => cat.category_id === chore.category_id
          );
          return {
            ...chore,
            category_name: category
              ? category.category_name
              : "Unknown Category",
          };
        });

        const totalMinutes = choresWithCategoryNames.reduce(
          (sum, chore) => sum + chore.total_minutes,
          0
        );
        const totalValue = choresWithCategoryNames.reduce(
          (sum, chore) => sum + (parseFloat(chore.total_monetary_value) || 0),
          0
        );

        return {
          username: member.username,
          avatar: member.avatar,
          totalMinutes,
          totalValue,
          chores: choresWithCategoryNames,
        };
      })
    );

    return membersWithChores;
  });
};

export const getHouseholdChoreOverviewForDoubleBar = async () => {
  return await apiRequest(async () => {
    const user = await getUser();
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

        const totalMinutes = chores.reduce(
          (acc, chore) => acc + chore.total_minutes,
          0
        );

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
  });
};
