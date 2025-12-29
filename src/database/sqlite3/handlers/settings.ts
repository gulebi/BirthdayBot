import db from "..";
import { Settings } from "../../../types";

// type BindParamsFromKeys<T, K extends readonly (keyof T)[]> = {
//     [I in keyof K]: T[K[I]];
// };

type SettingsRow = {
    guildID: string;
    channelID: string;
    allowUsersManage: number;
    lastUpdatedBy: string;
    lastUpdatedDate: string;
    version: number;
};

const toSettings = (row: SettingsRow): Settings => ({
    guildID: row.guildID,
    channelID: row.channelID,
    allowUsersManage: Boolean(row.allowUsersManage),
    lastUpdatedBy: row.lastUpdatedBy,
    lastUpdatedDate: new Date(row.lastUpdatedDate),
    version: row.version,
});

// export async function settingsGet(guildID: string): Promise<Settings | null> {
//     const row = db
//         .prepare<BindParamsFromKeys<SettingsRow, ["guildID"]>, SettingsRow | undefined>(
//             `SELECT * FROM settings WHERE guildID = ?`
//         )
//         .get(guildID);
//     if (!row) return null;
//     return toSettings(row);
// }

export async function settingsGet(guildID: string): Promise<Settings | null> {
    const row = db.prepare(`SELECT * FROM settings WHERE guildID = ?`).get(guildID) as SettingsRow | undefined;
    if (!row) return null;
    return toSettings(row);
}

export async function settingsSet(guildID: string, channelID: string, lastUpdatedBy: string): Promise<Settings> {
    const existing = db.prepare(`SELECT * FROM settings WHERE guildID = ?`).get(guildID) as SettingsRow | undefined;
    const now = new Date();

    if (existing) {
        const newVersion = existing.version + 1;
        db.prepare(
            `UPDATE settings
             SET channelID = ?, lastUpdatedBy = ?, lastUpdatedDate = ?, version = ?
             WHERE guildID = ?`
        ).run(channelID, lastUpdatedBy, now.toISOString(), newVersion, guildID);

        return toSettings({
            ...existing,
            channelID,
            lastUpdatedBy,
            lastUpdatedDate: now.toISOString(),
            version: newVersion,
        });
    }

    db.prepare(
        `INSERT INTO settings (guildID, channelID, allowUsersManage, lastUpdatedBy, lastUpdatedDate, version)
         VALUES (?, ?, ?, ?, ?, ?)`
    ).run(guildID, channelID, 0, lastUpdatedBy, now.toISOString(), 1);

    return {
        guildID,
        channelID,
        allowUsersManage: false,
        lastUpdatedBy,
        lastUpdatedDate: now,
        version: 1,
    };
}
