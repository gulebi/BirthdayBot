import { model } from "mongoose";
import { BirthdaySchema, SettingsSchema } from "./Schemas";

const BirthdayModel = model("birthdays", BirthdaySchema);

const SettingsModel = model("settings", SettingsSchema);

export { BirthdayModel, SettingsModel };
