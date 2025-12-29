import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
import cron from "node-cron";
import { client } from "./index";
import { birthdayList, settingsGet } from "./mongo";
import { Birthday } from "./types";
import { get } from "http";
import getEnvVar from "./utils/env";

async function checkOnBirthday() {
    const currentDate = dayjs();

    const guilds = client.guilds.cache;

    for (const [guildID] of guilds) {
        const settings = await settingsGet(guildID);
        if (!settings) continue;

        const list = await birthdayList(guildID);
        for (const el of list) {
            if (el.date === currentDate.format("DD.MM")) {
                await sendCongratulation(el, settings.channelID);
            }
        }
    }

    // const dateObjects = list.map((obj) => {
    //     let date = dayjs(`${obj.date}.${new Date().getFullYear()}`, "DD.MM.YYYY");

    //     if (date.isBefore(currentDate)) date = date.add(1, "year");

    //     return {
    //         ...obj,
    //         date,
    //     };
    // });

    // const nearestNextDate = dateObjects.reduce((a, b) => {
    //     return b.date.diff(currentDate) < a.date.diff(currentDate) ? b : a;
    // });

    // const user = await client.users.fetch(nearestNextDate.userID);

    // client.user?.setActivity(`Next birthday is ${user.username} | ${nearestNextDate.date.format("DD.MM")}`, {
    //     type: ActivityType.Custom,
    // });
}

async function sendCongratulation(birthday: Birthday, channelID: string) {
    const channel = client.channels.cache.get(channelID);

    if (channel?.isSendable()) {
        const message = await channel?.send(
            `Hey, @everyone! Today is the birthday of <@${birthday.userID}>! 🎂 \nDon't forget to congratulate!`
        );
        await message.react("🎉");
    }
}

export async function setupCongratulator() {
    const announcementHour = getEnvVar("ANNOUNCEMENT_HOUR", "6");
    const announcementTimezone = getEnvVar("ANNOUNCEMENT_TIMEZONE", "Europe/London");
    cron.schedule(`0 ${announcementHour} * * *`, checkOnBirthday, {
        timezone: announcementTimezone,
    });
    console.log("Congratulator is launched!");
    checkOnBirthday();
}
