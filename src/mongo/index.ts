import mongoose from "mongoose";
import getEnvVar from "../utils/env";
import { BirthdayModel, SettingsModel } from "./Models";
import { Birthday, Settings } from "../types";

export async function mongoConnect() {
    await mongoose.connect(getEnvVar("MONGODB_URI")).then(
        () => console.log("Bot has connected to MongoDB!"),
        (err) => console.error(err)
    );
}

export async function birthdayAdd(guildID: string, userID: string, date: string, addedBy: string): Promise<Birthday> {
    const added = await BirthdayModel.create({
        guildID,
        userID,
        date,
        addedBy,
        addedDate: new Date(),
        lastUpdatedBy: addedBy,
        lastUpdatedDate: new Date(),
        version: 1,
    });
    return added;
}

export async function birthdayUpdate(
    guildID: string,
    userID: string,
    date: string,
    updatedBy: string
): Promise<Birthday | null> {
    const updated = await BirthdayModel.findOneAndUpdate(
        { guildID, userID },
        { date, lastUpdatedBy: updatedBy, lastUpdatedDate: new Date(), $inc: { version: 1 } },
        { new: true }
    );
    return updated;
}

export async function birthdayRemove(guildID: string, userID: string): Promise<Birthday | null> {
    const removed = await BirthdayModel.findOneAndDelete({ guildID, userID });
    return removed;
}

export async function birthdayList(guildID: string): Promise<Birthday[]> {
    const list = await BirthdayModel.find({ guildID }).lean();
    return list;
}

export async function settingsGet(guildID: string): Promise<Settings | null> {
    const settings = await SettingsModel.findOne({ guildID }).lean();
    return settings;
}

export async function settingsSet(guildID: string, channelID: string, lastUpdatedBy: string): Promise<Settings> {
    const settings = await SettingsModel.findOneAndUpdate(
        { guildID },
        { guildID, channelID, lastUpdatedBy, lastUpdatedDate: new Date(), $inc: { version: 1 } },
        { upsert: true, new: true }
    );
    return settings;
}
