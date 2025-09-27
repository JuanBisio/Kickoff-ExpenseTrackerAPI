import { Schema, model, Document } from "mongoose";

export interface IDailyTotal extends Document {
  dateKey: string;   // "YYYY-MM-DD"
  total: number;     // suma de amount de ese día
  createdAt: Date;
  updatedAt: Date;
}

const DailyTotalSchema = new Schema<IDailyTotal>({
  dateKey: { type: String, required: true, unique: true, index: true },
  total:   { type: Number, required: true, min: 0 },
}, { timestamps: true });

export const DailyTotal = model<IDailyTotal>("DailyTotal", DailyTotalSchema);
