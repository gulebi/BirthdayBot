import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
import cron from "node-cron";
import { ActivityType, Snowflake } from "discord.js";
import { client } from "./index";
import { birthdayList } from "./utils/mongo";
import { Birthday } from "./types";
import getEnvVar from "./utils/env";

async function checkOnBirthday() {
    const currentDate = dayjs();

    const list = await birthdayList();
    for (const el of list) {
        if (el.date === currentDate.format("DD.MM")) {
            await sendCongratulation(el);
        }
    }

    const dateObjects = list.map((obj) => {
        let date = dayjs(`${obj.date}.${new Date().getFullYear()}`, "DD.MM.YYYY");

        if (date.isBefore(currentDate)) date = date.add(1, "year");

        return {
            ...obj,
            date,
        };
    });

    const nearestNextDate = dateObjects.reduce((a, b) => {
        return b.date.diff(currentDate) < a.date.diff(currentDate) ? b : a;
    });

    const user = await client.users.fetch(nearestNextDate.userID);

    client.user?.setActivity(`Следующий день рождения у ${user.username} | ${nearestNextDate.date.format("DD.MM")}`, {
        type: ActivityType.Custom,
    });
}

async function sendCongratulation(birthday: Birthday) {
    const channelID: Snowflake = getEnvVar("CHANNEL_ID");

    const channel = client.channels.cache.get(channelID);

    if (channel?.isTextBased()) {
        const message = await channel?.send(
            `Хей, @everyone! Сегодня, день рождения <@${birthday.userID}>! 🎂 \nНе забудьте поздравить именинника!`
        );
        await message.react("🎉");
    }
}

export async function setup() {
    cron.schedule("0 6 * * *", checkOnBirthday, {
        scheduled: true,
        timezone: "Asia/Atyrau",
        runOnInit: true,
    });
    console.log("Congratulator is launched!");
}
