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

export const updateUserDetails = async (username, pronouns, avatar) => {
	try {
		const { data, error: userError } = await supabase.auth.getUser();
		if (userError) throw userError;

		if (data && data.user) {
			const user = data.user;
			const { error: updateError } = await supabase
				.from("user_details")
				.insert([{ user_id: user.id, username, pronouns, avatar }], { upsert: true });

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

export const linkUserToHousehold = async (householdName, sizeInSqm, numberOfRooms) => {
	const { data: userData, error: userError } = await supabase.auth.getUser();
	if (userError) throw userError;

	const user = userData.user;
	if (!user) throw new Error("No user logged in.");

	// Check if a household with the given name already exists
	let { data: households, error } = await supabase
		.from("household_details")
		.select("household_id")
		.eq("household_name", householdName);

	if (error && error.message !== "No rows found") throw error;

	let householdId;
	if (households && households.length > 0) {
		// Household already exists
		householdId = households[0].household_id;
	} else {
		// Create a new household
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

		if (newHouseholdError) throw newHouseholdError;
		householdId = newHousehold.household_id;
	}

	// Link the user to the household
	const { error: linkError } = await supabase
		.from("user_details")
		.update({ household_id: householdId })
		.eq("user_id", user.id);

	if (linkError) throw linkError;

	console.log("User linked to household successfully.");
};

export const signIn = async (email, password) => {
	const { user, error } = await supabase.auth.signIn({ email, password });
	if (error) throw error;
	return user;
};
