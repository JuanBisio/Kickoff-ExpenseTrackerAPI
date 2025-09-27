import "dotenv/config";
import { connectDB } from "data/db";
import app from "app";
import { scheduleDailyTotals } from "services/dailyTotalsJob";
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGODB_URI!;

async function main() {
  await connectDB(MONGO_URI);
  scheduleDailyTotals();    
  app.listen(PORT, () => console.log(`API:${PORT}`));
}

main().catch(err => { console.error(err); process.exit(1); });
