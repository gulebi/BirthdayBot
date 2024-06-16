import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
import cron from "node-cron";
import { ActivityType, Snowflake, TextChannel } from "discord.js";
import { client } from ".";
import { birthdayList } from "./utils/mongo";
import { IBirthday } from "./types";

async function check() {
    const currentDate = dayjs();

    const list = await birthdayList();
    for (const el of list) {
        if (el.date === currentDate.format("DD.MM")) {
            send(el);
        }
    }

    const dateObjects = list.map((obj) => ({
        ...obj,
        date: dayjs(`${obj.date}.${new Date().getFullYear()}`, "DD.MM.YYYY"),
    }));

    const nearestNextDate = dateObjects.reduce((a, b) => {
        return b.date.isAfter(currentDate) && b.date.diff(currentDate) < a.date.diff(currentDate) ? b : a;
    });

    const user = await client.users.fetch(nearestNextDate.userID);

    client.user?.setActivity(`Следующий день рождения у ${user.username} | ${nearestNextDate.date.format("DD.MM")}`, {
        type: ActivityType.Custom,
    });
}

function send(birthday: IBirthday) {
    const channelID: Snowflake = "792258704946102283";

    const channel = client.channels.cache.get(channelID);

    if (channel?.isTextBased()) {
        channel?.send(
            `Хей, @everyone! Сегодня, день рождения <@${birthday.userID}>! 🎂 \nНе забудьте поздравить именинника!`
        );
    }
}

export async function setup() {
    cron.schedule("0 6 * * *", check);
    console.log("Congratulator is launched!");
    await check();
}
