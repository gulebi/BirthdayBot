import { model } from "mongoose";
import { BirthdaySchema } from "./Schemas";

const BirthdayModel = model("birthdays", BirthdaySchema);

export { BirthdayModel };
