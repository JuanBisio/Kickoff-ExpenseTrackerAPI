// cron/dailyTotalsJob.ts
import cron from "node-cron";
import { DailyTotal } from "../models/DailyTotal.ts";
import { Expense } from "../models/Expense.ts";


// Formatea fecha "YYYY-MM-DD"
function ymd(d: Date) {
  // d es local 
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2, "0"); //padStart completa con 0 a la izquierda ejemplo 07 (Julio)
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Calcula total de gastos para un día y lo guarda en DailyTotal
async function computeForDay(day: Date) {
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0,0,0,0); // inicio del día
  const end   = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23,59,59,999); // fin del día
  const dateKey = ymd(start); //Formatea la fecha de inicio del día "YYYY-MM-DD"

  const [result] = await Expense.aggregate([
    // aggregate devuelve un array siempre aunquesea un solo resultado
    { $match: { date: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: "$amount" } } } // id null porque no nos interesa agrupar por ningún campo
    //{ $group: { _id: "$paid", total: { $sum: "$amount" } } } // ejemplo agrupar por pagado o no pagado
  ]);

  const total = result?.total || 0;
  await DailyTotal.updateOne(
    { dateKey }, // filtro
    { $set: { total } }, //actualiza total
    { upsert: true } //opciones (upsert: true crea si no existe)
  ); 
  console.log(`DailyTotal upsert ${dateKey} = ${total}`);
}

export async function runOnceForYesterday() {
  //Calcular la fecha de ayer
  const now = new Date();
  const y = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
  await computeForDay(y);
}

// Programa 00:05 hora local todos los días
export function scheduleDailyTotals() {
  cron.schedule("5 0 * * *", async () => { // 00:05 cada día
    try { await runOnceForYesterday(); } catch (e) { console.error(e); }
  });
  console.log("Cron daily totals programado 00:05 local");
}
