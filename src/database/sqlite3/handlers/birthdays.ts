import db from "..";
import { Birthday } from "../../../types";

type BindParamsFromKeys<T, K extends readonly (keyof T)[]> = {
    [I in keyof K]: T[K[I]];
};

type BirthdayRow = {
    guildID: string;
    userID: string;
    date: string;
    addedBy: string;
    addedDate: string;
    lastUpdatedBy: string;
    lastUpdatedDate: string;
    version: number;
};

const toBirthday = (row: BirthdayRow): Birthday => ({
    guildID: row.guildID,
    userID: row.userID,
    date: row.date,
    addedBy: row.addedBy,
    addedDate: new Date(row.addedDate),
    lastUpdatedBy: row.lastUpdatedBy,
    lastUpdatedDate: new Date(row.lastUpdatedDate),
    version: row.version,
});

export async function birthdayAdd(guildID: string, userID: string, date: string, addedBy: string): Promise<Birthday> {
    const now = new Date();
    const addedDate = now.toISOString();

    db.prepare(
        `INSERT INTO birthdays (guildID, userID, date, addedBy, addedDate, lastUpdatedBy, lastUpdatedDate, version)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(guildID, userID, date, addedBy, addedDate, addedBy, addedDate, 1);

    return {
        guildID,
        userID,
        date,
        addedBy,
        addedDate: now,
        lastUpdatedBy: addedBy,
        lastUpdatedDate: now,
        version: 1,
    };
}

export async function birthdayUpdate(
    guildID: string,
    userID: string,
    date: string,
    updatedBy: string
): Promise<Birthday | null> {
    const existing = db
        .prepare<BindParamsFromKeys<BirthdayRow, ["guildID", "userID"]>, BirthdayRow | undefined>(
            `SELECT * FROM birthdays WHERE guildID = ? AND userID = ?`
        )
        .get(guildID, userID);

    if (!existing) return null;

    const now = new Date();
    const newVersion = existing.version + 1;

    db.prepare(
        `UPDATE birthdays
         SET date = ?, lastUpdatedBy = ?, lastUpdatedDate = ?, version = ?
         WHERE guildID = ? AND userID = ?`
    ).run(date, updatedBy, now.toISOString(), newVersion, guildID, userID);

    return toBirthday({
        ...existing,
        date,
        lastUpdatedBy: updatedBy,
        lastUpdatedDate: now.toISOString(),
        version: newVersion,
    });
}

export async function birthdayRemove(guildID: string, userID: string): Promise<Birthday | null> {
    const existing = db
        .prepare<BindParamsFromKeys<BirthdayRow, ["guildID", "userID"]>, BirthdayRow | undefined>(
            `SELECT * FROM birthdays WHERE guildID = ? AND userID = ?`
        )
        .get(guildID, userID);

    if (!existing) return null;

    db.prepare(`DELETE FROM birthdays WHERE guildID = ? AND userID = ?`).run(guildID, userID);
    return toBirthday(existing);
}

export async function birthdayList(guildID: string): Promise<Birthday[]> {
    const rows = db
        .prepare<BindParamsFromKeys<BirthdayRow, ["guildID"]>, BirthdayRow>(`SELECT * FROM birthdays WHERE guildID = ?`)
        .all(guildID);
    return rows.map(toBirthday);
}
