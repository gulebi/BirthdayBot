import { Schema } from "mongoose";
import { IBirthday } from "../types";

const BirthdaySchema = new Schema<IBirthday>({
    userID: String,
    date: String,
    ver: Number,
});

export { BirthdaySchema };
