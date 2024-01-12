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

export const linkUserToHousehold = async (householdName, sizeInSqm) => {
	const { data } = await supabase.auth.getUser();
	const user = data.user;

	if (!user) throw new Error("No user logged in.");

	// Check if the household exists
	let { data: household, error } = await supabase
		.from("household_details")
		.select("household_id")
		.eq("household_name", householdName)
		.single();

	if (error && error.message !== "No rows found") throw error;

	// If the household doesn't exist, create a new one
	if (!household) {
		({ data: household, error } = await supabase
			.from("household_details")
			.insert([{ household_name: householdName, size_in_sqm: sizeInSqm }])
			.single());

		if (error) throw error;
	}

	// Link the user to the household
	const { error: linkError } = await supabase
		.from("user_details")
		.update({ household_id: household.household_id })
		.eq("user_id", user.id);

	if (linkError) throw linkError;
};

export const signIn = async (email, password) => {
	const { user, error } = await supabase.auth.signIn({ email, password });
	if (error) throw error;
	return user;
};
