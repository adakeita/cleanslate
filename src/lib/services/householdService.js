import { apiRequest, getUser } from "./baseApiService";
import supabase from "../supabaseConfig";
import { updateHouseholdDataInCompleteUser } from "./userService";

export const createNewHousehold = async (
  householdName,
  sizeInSqm,
  numberOfRooms
) => {
  return await apiRequest(async () => {
    const { data: existingHousehold, error: existingError } = await supabase
      .from("household_details")
      .select("household_id")
      .eq("household_name", householdName)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existingHousehold) throw new Error("Household name already taken.");

    const { error: insertError } = await supabase
      .from("household_details")
      .insert([
        {
          household_name: householdName,
          size_in_sqm: sizeInSqm,
          number_of_rooms: numberOfRooms,
        },
      ]);
    if (insertError) throw insertError;

    const { data: newHousehold } = await supabase
      .from("household_details")
      .select("household_id")
      .eq("household_name", householdName)
      .single();
    if (!newHousehold || !newHousehold.household_id) {
      throw new Error("Failed to create new household.");
    }

    const user = await getUser();
    const { error: linkError } = await supabase
      .from("user_details")
      .update({ household_id: newHousehold.household_id })
      .eq("user_id", user.id);
    if (linkError) throw linkError;

    await updateHouseholdDataInCompleteUser();
    return { household_id: newHousehold.household_id };
  });
};

export const joinHouseholdUsingToken = async (token) => {
  return await apiRequest(async () => {
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

    const user = await getUser();
    if (!user)
      throw new Error("User must be logged in to accept an invitation.");

    await supabase
      .from("household_invitations")
      .update({ used: true })
      .eq("id", invitation.id);

    await supabase
      .from("user_details")
      .update({ household_id: invitation.household_id })
      .eq("user_id", user.id);

    await updateHouseholdDataInCompleteUser();
    console.log("Invitation accepted successfully.");
  });
};

export const linkUserToHousehold = async (
  householdName,
  sizeInSqm,
  numberOfRooms
) => {
  return await apiRequest(async () => {
    const user = await getUser();
    if (!user) throw new Error("No user logged in.");

    const createdHousehold = await createNewHousehold(
      householdName,
      sizeInSqm,
      numberOfRooms
    );

    const { error: linkError } = await supabase
      .from("user_details")
      .update({ household_id: createdHousehold.household_id })
      .eq("user_id", user.id);
    if (linkError) throw linkError;

    return { household_id: createdHousehold.household_id };
  });
};
