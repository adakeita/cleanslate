import supabase from "./supabase";

export const signUp = async (email, password, name, username, pronouns) => {
	if (!email || !password || !username || !name) {
		throw new Error("Please fill in all required fields.");
	}

	try {
		const { user, error } = await supabase.auth.signUp({ email, password });

		if (error) throw new Error(error.message);

		console.log("Signup result:", user); // Check the output of the signup process

		// Ensure user object is valid before proceeding
		if (!user) throw new Error("Signup failed, no user returned.");

		// Insert additional user profile information
		const { error: profileError } = await supabase
			.from("user_profiles")
			.insert([{ user_id: user.id, name, username, pronouns }]);

		if (profileError) throw new Error(profileError.message);

		// Fetch complete user details
		const { data: completeUserProfile, error: fetchError } = await supabase
			.from("user_profiles")
			.select("name, username, pronouns, user_id, users!inner(email)")
			.eq("user_id", user.id)
			.single();

		if (fetchError) throw new Error(fetchError.message);

		return completeUserProfile;
	} catch (error) {
		console.error("Signup process error:", error.message);
		throw error;
	}
};

export const signIn = async (email, password) => {
	const { user, error } = await supabase.auth.signIn({ email, password });
	if (error) throw error;
	return user;
};
