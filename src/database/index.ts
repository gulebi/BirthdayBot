import getEnvVar from "../utils/env";
import {
    mongoInit,
    birthdayAdd as mongoBirthdayAdd,
    birthdayUpdate as mongoBirthdayUpdate,
    birthdayRemove as mongoBirthdayRemove,
    birthdayList as mongoBirthdayList,
    settingsGet as mongoSettingsGet,
    settingsSet as mongoSettingsSet,
} from "./mongo";
import {
    sqliteInit,
    birthdayAdd as sqliteBirthdayAdd,
    birthdayUpdate as sqliteBirthdayUpdate,
    birthdayRemove as sqliteBirthdayRemove,
    birthdayList as sqliteBirthdayList,
    settingsGet as sqliteSettingsGet,
    settingsSet as sqliteSettingsSet,
} from "./sqlite3";

type Driver = "mongo" | "sqlite";

const activeDriver = getEnvVar<Driver>("DB_DRIVER", "mongo");

const driverImpl =
    activeDriver === "mongo"
        ? {
              init: mongoInit,
              birthdayAdd: mongoBirthdayAdd,
              birthdayUpdate: mongoBirthdayUpdate,
              birthdayRemove: mongoBirthdayRemove,
              birthdayList: mongoBirthdayList,
              settingsGet: mongoSettingsGet,
              settingsSet: mongoSettingsSet,
          }
        : {
              init: sqliteInit,
              birthdayAdd: sqliteBirthdayAdd,
              birthdayUpdate: sqliteBirthdayUpdate,
              birthdayRemove: sqliteBirthdayRemove,
              birthdayList: sqliteBirthdayList,
              settingsGet: sqliteSettingsGet,
              settingsSet: sqliteSettingsSet,
          };

export const init = driverImpl.init;
export const birthdayAdd = driverImpl.birthdayAdd;
export const birthdayUpdate = driverImpl.birthdayUpdate;
export const birthdayRemove = driverImpl.birthdayRemove;
export const birthdayList = driverImpl.birthdayList;
export const settingsGet = driverImpl.settingsGet;
export const settingsSet = driverImpl.settingsSet;

export { activeDriver };
