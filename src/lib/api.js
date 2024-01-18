import supabase from "./supabaseClient";

export const signUp = async (email, password) => {
	if (!email || !password) {
		throw new Error("Email and password are required.");
	}

	try {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			console.error("Signup error:", error);
			throw new Error(error.message || "Error during signup");
		}

		console.log("Signup successful:", data);
		return data;
	} catch (error) {
		console.error("Signup process error:", error);
		throw error;
	}
};

export const updateUserDetails = async (username, pronouns, avatar, alternate_avatar) => {
	try {
		const { data, error: userError } = await supabase.auth.getUser();
		if (userError) throw userError;

		if (data && data.user) {
			const user = data.user;
			const { error: updateError } = await supabase
				.from("user_details")
				.insert([{ user_id: user.id, username, pronouns, avatar, alternate_avatar }], {
					upsert: true,
				});

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

export const signIn = async (email, password) => {
	try {
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error) {
			throw error;
		}

		return data;
	} catch (error) {
		console.error("Error signing in:", error.message);
		throw error;
	}
};

const createNewHousehold = async (householdName, sizeInSqm, numberOfRooms) => {
	try {
		// Insert new household
		const { error: insertError } = await supabase.from("household_details").insert([
			{
				household_name: householdName,
				size_in_sqm: sizeInSqm,
				number_of_rooms: numberOfRooms,
			},
		]);

		if (insertError) {
			console.error("Error inserting new household:", insertError);
			throw new Error("Failed to create new household.");
		}

		// Query for the newly created household
		const { data: newHousehold, error: queryError } = await supabase
			.from("household_details")
			.select("household_id")
			.eq("household_name", householdName)
			.single();

		if (queryError) {
			console.error("Error querying new household:", queryError);
			throw new Error("Failed to retrieve new household.");
		}

		if (!newHousehold || !newHousehold.household_id) {
			throw new Error("New household creation failed or household_id is missing.");
		}

		return newHousehold;
	} catch (error) {
		console.error("Error in createNewHousehold function:", error);
		throw error;
	}
};

export const linkUserToHousehold = async (householdName, sizeInSqm, numberOfRooms) => {
	try {
		// Get current user
		const { data: userData, error: userError } = await supabase.auth.getUser();
		if (userError) throw userError;
		const user = userData.user;
		if (!user) throw new Error("No user logged in.");

		// Check if a household with the given name already exists
		let { data: households, error: householdError } = await supabase
			.from("household_details")
			.select("household_id")
			.eq("household_name", householdName);

		if (householdError) throw householdError;

		let householdId;

		// If no existing household, create a new one
		if (!households || households.length === 0) {
			const createdHousehold = await createNewHousehold(
				householdName,
				sizeInSqm,
				numberOfRooms
			);
			householdId = createdHousehold.household_id;
		} else {
			// Use the existing household ID
			householdId = households[0].household_id;
		}

		// Link the user to the household
		const { error: linkError } = await supabase
			.from("user_details")

			.update({ household_id: householdId })
			.eq("user_id", user.id);

		if (linkError) throw linkError;

		console.log("User linked to household successfully.");
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

		// Link the user to the existing household
		const householdId = households[0].household_id;
		const { error: linkError } = await supabase
			.from("user_details")
			.update({ household_id: householdId })
			.eq("user_id", user.id);

		if (linkError) throw linkError;

		console.log("User joined household successfully.");
	} catch (error) {
		console.error("Error in joinExistingHousehold function:", error);
		throw error;
	}
};

export const getCompleteUser = async () => {
	try {
		// Get the current user
		const { data: userData, error: userError } = await supabase.auth.getUser();
		if (userError) throw userError;

		const user = userData.user;
		if (!user) throw new Error("No user logged in.");

		// Get user details from "user_details" table
		const { data: userDetails, error: userDetailsError } = await supabase
			.from("user_details")
			.select("id, username, pronouns, avatar, alternate_avatar, household_id")
			.eq("user_id", user.id)
			.single();

		if (userDetailsError) throw userDetailsError;

		let householdDetails = null;
		if (userDetails && userDetails.household_id) {
			// Get household details from "household_details" table
			const { data: fetchedHouseholdDetails, error: householdDetailsError } =
				await supabase
					.from("household_details")
					.select("household_name, number_of_rooms, size_in_sqm")
					.eq("household_id", userDetails.household_id)
					.single();

			if (householdDetailsError) throw householdDetailsError;
			householdDetails = fetchedHouseholdDetails;
		}

		// Get other users in the same household
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
			duration_in_sessions
		`
			)
			.eq("user_detail_id", userDetails.id);

		if (choresError) {
			console.error("Error fetching user chores:", choresError);
			throw new Error(choresError.message || "Error fetching user chores.");
		}

		// Create a complete user object
		const completeUser = {
			id: user.id,
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

		console.log("Complete user retrieved successfully.");
		console.log(completeUser);
		return completeUser;
	} catch (error) {
		console.error("Error getting complete user:", error);
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
			throw new Error(userDetailsError.message || "Error fetching user details.");
		}

		// Insert the chore log into the database without monetary_value
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

export const getUserChoreOverview = async () => {
	try {
		// Get the complete user details including chores
		const completeUser = await getCompleteUser();
		console.log("Chores:", completeUser.chores);
		if (!completeUser) throw new Error("User data not found.");

		// Fetch the chore categories and their rates
		const { data: categories, error: categoriesError } = await supabase
			.from("chore_categories")
			.select("category_id, category_name, rate_per_15_min");

		console.log(categories);

		if (categoriesError) throw categoriesError;

		// Initialize the overview data structure
		const overviewData = categories.map((category) => ({
			category_name: category.category_name,
			total_minutes: 0,
			total_cost: 0,
			rate_per_15_min: category.rate_per_15_min,
		}));

		const subcategoryToCategoryMap = {
			1: "Cleaning and Sanitation",
			2: "HR",
			3: "Food Service",
			4: "Care Work",
		};

		// Calculate the total time and cost for each category based on the user's chore logs
		completeUser.chores.forEach((chore) => {
			const categoryName = subcategoryToCategoryMap[chore.subcategory_id];
			const category = overviewData.find((c) => c.category_name === categoryName);
			if (category) {
				const minutes = chore.duration_in_sessions * 15;
				category.total_minutes += minutes;
				category.total_cost += (minutes / 60) * category.rate_per_15_min * 4;
			}
		});

		// Calculate the grand totals
		const grandTotalMinutes = overviewData.reduce(
			(acc, category) => acc + category.total_minutes,
			0
		);
		const grandTotalCost = overviewData.reduce(
			(acc, category) => acc + category.total_cost,
			0
		);

		console.log("User chore overview retrieved successfully.");
		console.log(overviewData);

		return {
			overviewData,
			grandTotalMinutes,
			grandTotalCost,
		};
	} catch (error) {
		console.error("Error getting user chore overview:", error);
		throw error;
	}
};

export const signOut = async () => {
	try {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;

		localStorage.removeItem("access_token");
		localStorage.removeItem("username");
		localStorage.removeItem("theme");
		localStorage.removeItem("supabase.auth.session");
	} catch (error) {
		console.error("Error signing out:", error);
	}
};
