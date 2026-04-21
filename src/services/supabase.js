import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://mvfutjmjzvykbhdyihrd.supabase.co";

const supabaseKey =
  "sb_publishable__6sYJ3p1tvVNk5qY2djQGA_C6OxNv6c"

export const saveExpense = async (expense) => {
  console.log("Saving expense to Supabase:", expense);

  const { data, error } = await supabase
    .from("expenses")
    .insert([
      {
        title: expense.title,
        amount: expense.amount,
        paid_by: expense.paidBy,      // FIXED
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

export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  );