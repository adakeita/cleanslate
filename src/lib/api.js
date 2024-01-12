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

export const signIn = async (email, password) => {
	const { user, error } = await supabase.auth.signIn({ email, password });
	if (error) throw error;
	return user;
};
