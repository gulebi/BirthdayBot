import { Settings } from "../../../types";
import { SettingsModel } from "../Models";

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
