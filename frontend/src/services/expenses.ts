import axios from "axios";
import { Expense } from "../types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

interface CreateExpenseData {
  tripId: string;
  description: string;
  amount: number;
  date: string;
}

export const createExpense = async (
  data: CreateExpenseData
): Promise<Expense> => {
  const response = await axios.post(
    `${API_URL}/trips/${data.tripId}/expenses`,
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

export const deleteExpense = async (
  tripId: string,
  expenseId: string
): Promise<void> => {
  await axios.delete(`${API_URL}/trips/${tripId}/expenses/${expenseId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
