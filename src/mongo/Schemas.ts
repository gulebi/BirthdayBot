import { Schema } from "mongoose";
import { Birthday, Settings } from "../types";

const BirthdaySchema = new Schema<Birthday>({
    guildID: String,
    userID: String,
    date: String,
    addedBy: String,
    addedDate: { type: Date, default: Date.now },
    lastUpdatedBy: String,
    lastUpdatedDate: { type: Date, default: Date.now },
    version: { type: Number, default: 0 },
});

const SettingsSchema = new Schema<Settings>({
    guildID: String,
    channelID: String,
    allowUsersManage: { type: Boolean, default: false },
    lastUpdatedBy: String,
    lastUpdatedDate: { type: Date, default: Date.now },
    version: { type: Number, default: 0 },
});

export { BirthdaySchema, SettingsSchema };
