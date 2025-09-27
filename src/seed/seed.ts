import mongoose from "mongoose";
import { Expense } from "../models/Expense";
import { connectDB } from "../data/db";

async function seed() {
  const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/expenses_db";
  await connectDB(MONGO_URI);

  // Clean existing expenses
  await Expense.deleteMany({});

  // Insert seed data
  const sampleExpenses = [
    { amount: 120.50, paid: true, date: new Date("2025-09-20T10:00:00"), description: "Groceries - supermarket" },
    { amount: 45.00, paid: false, date: new Date("2025-09-20T15:30:00"), description: "Gas station" },
    { amount: 300.00, paid: true, date: new Date("2025-09-21T09:00:00"), description: "Rent September" },
    { amount: 25.75, paid: false, date: new Date("2025-09-21T13:15:00"), description: "Coffee with friends" },
    { amount: 90.00, paid: true, date: new Date("2025-09-22T18:00:00"), description: "Restaurant dinner" },
    { amount: 15.00, paid: false, date: new Date("2025-09-22T20:00:00"), description: "Bus tickets" },
    { amount: 60.00, paid: true, date: new Date("2025-09-23T11:30:00"), description: "Gym membership" },
    { amount: 200.00, paid: false, date: new Date("2025-09-23T14:45:00"), description: "New headphones" },
    { amount: 80.00, paid: true, date: new Date("2025-09-24T16:20:00"), description: "Clothes shopping" },
    { amount: 50.00, paid: false, date: new Date("2025-09-24T19:10:00"), description: "Movie night" },
    { amount: 100.00, paid: true, date: new Date("2025-09-25T12:00:00"), description: "Monthly subscription" },
    { amount: 30.00, paid: false, date: new Date("2025-09-25T17:30:00"), description: "Books purchase" },
  ];

  await Expense.insertMany(sampleExpenses);
  console.log("Seed data inserted");
  process.exit(0);
}

seed().catch(err => {
  console.error("Error seeding data:", err);
  process.exit(1);
});
