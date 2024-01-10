import { createClient } from "@supabase/supabase-js";

export default async (req, res) => {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { SUPABASE_SERVICE_KEY, SUPABASE_URL } = process.env;
	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

	const { user_id, name, username, pronouns } = req.body;

	try {
		const { error } = await supabase
			.from("user_profiles")
			.insert([{ user_id, name, username, pronouns }]);

		if (error) {
			return res.status(500).json({ error: error.message });
		}

		res.status(200).json({ message: "Profile created successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
