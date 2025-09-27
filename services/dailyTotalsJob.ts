// cron/dailyTotalsJob.ts
import cron from "node-cron";
import { DailyTotal } from "../models/DailyTotal.ts";
import { Expense } from "../models/Expense.ts";

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function computeForDay(day: Date) {
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0,0,0,0);
  const end   = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23,59,59,999);
  const dateKey = ymd(start);

  const [result] = await Expense.aggregate([
    { $match: { date: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const total = result?.total || 0;
  await DailyTotal.updateOne({ dateKey }, { $set: { total } }, { upsert: true });
  console.log(`✅ DailyTotal upsert ${dateKey} = ${total}`);
}

export async function runOnceForYesterday() {
  const now = new Date();
  const y = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
  await computeForDay(y);
}

// Programa 00:05 hora local todos los días
export function scheduleDailyTotals() {
  cron.schedule("5 0 * * *", async () => {
    try { await runOnceForYesterday(); } catch (e) { console.error(e); }
  });
  console.log("⏰ Cron daily totals programado 00:05 local");
}

if (process.argv.includes("--run-once")) {
  runOnceForYesterday().then(() => process.exit(0));
}