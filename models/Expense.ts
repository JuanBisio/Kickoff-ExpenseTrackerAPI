import { Schema, model, Document } from "mongoose";

// Definir interfaz de ts para un gasto 
export interface InterfaceExpense extends Document {
  amount: number;
  paid: boolean;
  date: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

// Definir el esquema para moongo de un gasto 
const expenseSchema = new Schema<InterfaceExpense>(
 {
    amount: { type: Number, required: true, min: 0 },
    paid: { type: Boolean, default: false },
    date: { type: Date, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true } 
);

export const Expense = model<InterfaceExpense>("Expense", expenseSchema);