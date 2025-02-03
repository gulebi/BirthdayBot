import { Schema } from "mongoose";
import { Birthday } from "../types";

const BirthdaySchema = new Schema<Birthday>({
    userID: String,
    date: String,
    ver: Number,
});

export { BirthdaySchema };
