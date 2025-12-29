import Database from "better-sqlite3";
import getEnvVar from "../../utils/env";
const db = new Database(getEnvVar("SQLITE_DB_PATH", "./birthday-bot.db"));

export default db;
