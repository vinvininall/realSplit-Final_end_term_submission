import { createClient } from "@supabase/supabase-js";


const supabaseUrl =
  "https://mvfutjmjzvykbhdyihrd.supabase.co";

const supabaseKey =
  "sb_publishable__6sYJ3p1tvVNk5qY2djQGA_C6OxNv6c";
export const supabase = createClient(supabaseUrl, supabaseKey);

export const saveExpense = async (expense) => {
  console.log("Saving expense to Supabase:", expense);

  const { data, error } = await supabase
    .from("expenses")
    .insert([
      {
        title: expense.title,
        amount: expense.amount,
        paid_by: expense.paidBy,
        participants: expense.participants,
      },
    ])
    .select();

  console.log("Supabase response:", data, error);

  if (error) {
    console.error("Insert error:", error);
  }

  return data;
};

export const getExpenses = async () => {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch error:", error);
    return [];
  }

  return data;
};

// Save a settlement (when someone pays someone back)
export const saveSettlement = async (settlement) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("settlements")
    .insert([{
      outing_id: settlement.outingId,
      from_user: settlement.fromUser,
      to_user: settlement.toUser,
      amount: settlement.amount,
      status: 'pending',
      user_id: user.id,
    }])
    .select();

  if (error) console.error("Error saving settlement:", error);
  return data;
};

// Mark a settlement as completed
export const completeSettlement = async (settlementId) => {
  const { data, error } = await supabase
    .from("settlements")
    .update({
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', settlementId);

  if (error) console.error("Error completing settlement:", error);
  return data;
};

// Get all settlements for current outing
export const getSettlements = async (outingId) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("settlements")
    .select("*")
    .eq('user_id', user.id)
    .eq('outing_id', outingId)
    .order('created_at', { ascending: false });

  if (error) console.error("Error fetching settlements:", error);
  return data || [];
};