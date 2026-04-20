import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://mvfutjmjzvykbhdyihrd.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12ZnV0am1qenZ5a2JoZHlpaHJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjkzMDQsImV4cCI6MjA5MjIwNTMwNH0.w5pn3K3lhRE_uHH-49Kady9V5KLUo-Fm5XuLDumBgXM"


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