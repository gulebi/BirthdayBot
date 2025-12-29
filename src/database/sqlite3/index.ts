import Database from "better-sqlite3";
import getEnvVar from "../../utils/env";

const db = new Database(getEnvVar("SQLITE_DB_PATH", "./birthday-bot.db"));

const createTables = () => {
    db.pragma("foreign_keys = ON");
    db.exec(`
		CREATE TABLE IF NOT EXISTS birthdays (
			guildID TEXT NOT NULL,
			userID TEXT NOT NULL,
			date TEXT NOT NULL,
			addedBy TEXT NOT NULL,
			addedDate TEXT NOT NULL,
			lastUpdatedBy TEXT NOT NULL,
			lastUpdatedDate TEXT NOT NULL,
			version INTEGER NOT NULL
		);

		CREATE TABLE IF NOT EXISTS settings (
			guildID TEXT PRIMARY KEY,
			channelID TEXT NOT NULL,
			allowUsersManage INTEGER NOT NULL DEFAULT 0,
			lastUpdatedBy TEXT NOT NULL,
			lastUpdatedDate TEXT NOT NULL,
			version INTEGER NOT NULL
		);

		CREATE UNIQUE INDEX IF NOT EXISTS idx_birthdays_guild_user ON birthdays (guildID, userID);
	`);
};

export function sqliteInit() {
    createTables();
    return db;
}

export * from "./handlers/birthdays";
export * from "./handlers/settings";

export default db;
