import supabase from "./supabaseClient";

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

const createNewHousehold = async (householdName, sizeInSqm, numberOfRooms) => {
	try {
		// Check if household with the same name already exists
		const { data: existingHousehold, error: existingError } = await supabase
			.from("household_details")
			.select("household_id")
			.eq("household_name", householdName)
			.single();

		if (existingError && existingError.code !== "PGRST116") {
			// Exclude "No rows returned" error
			throw existingError;
		}

		if (existingHousehold) {
			throw new Error("Household name already taken.");
		}

		// Insert new household details
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

		// Query for created household
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

		console.log("User linked to household successfully. Household ID:", householdId);
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
			const memberNames = householdMembers.map((member) => member.username).join(", ");
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
			throw new Error(userDetailsError.message || "Error fetching user details.");
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

export const getUserChoreOverview = async (userDetailId) => {
	try {
		// Ensure userDetailId is an integer
		const userDetailIdInt = parseInt(userDetailId, 10);
		if (isNaN(userDetailIdInt)) {
			throw new Error("Invalid user detail ID");
		}

		// Call the stored procedure
		const { data: aggregatedData, error: aggregationError } = await supabase.rpc(
			"get_user_chore_overview",
			{ user_detail_id_param: userDetailIdInt }
		);
		if (aggregationError) throw aggregationError;

		// Fetch category names
		const { data: categories, error: categoriesError } = await supabase
			.from("chore_categories")
			.select("category_id, category_name");
		if (categoriesError) throw categoriesError;

		// Merge category names with aggregated data
		const overviewData = categories.map((category) => {
			const aggregatedCategory = aggregatedData.find(
				(item) => item.category_id === category.category_id
			);
			return {
				category_name: category.category_name,
				category_id: category.category_id,
				total_minutes: aggregatedCategory ? aggregatedCategory.total_minutes : 0,
				total_cost: aggregatedCategory ? aggregatedCategory.total_cost : 0,
			};
		});

		return overviewData;
	} catch (error) {
		console.error("Error in getUserChoreOverview function:", error);
		throw error;
	}
};

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

		// Fetch chores for each member
		for (const member of members) {
			const { data: chores, error: choresError } = await supabase
				.from("chore_log")
				.select("total_minutes, total_monetary_value")
				.eq("user_detail_id", member.id);
			if (choresError) throw choresError;

			// Aggregate data
			member.totalMinutes = chores.reduce((acc, chore) => acc + chore.total_minutes, 0);
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

				// Calculate total minutes for the member
				const totalMinutes = chores.reduce((acc, chore) => acc + chore.total_minutes, 0);

				// Map category IDs to names and calculate percentages
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
		console.error("Error in getHouseholdChoreOverviewForDoubleBar function:", error);
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
