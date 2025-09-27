import express from "express";
import expensesRouter from "./routes/expenses.route";


const app = express();
app.use(express.json());
app.use("/expenses", expensesRouter);


export default app;
