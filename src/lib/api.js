import supabase from "./supabaseClient";

export const signIn = async (email, password) => {
	const { user, error } = await supabase.auth.signIn({ email, password });
	if (error) throw error;
	return user;
};
