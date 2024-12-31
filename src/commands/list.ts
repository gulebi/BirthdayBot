import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { birthdayList } from "../utils/mongo";

const command: SlashCommand = {
    data: new SlashCommandBuilder().setName("list").setDescription("Show list of birthdays"),
    execute: async (interaction) => {
        const list = await birthdayList();

        const sortedDates = list.sort((a, b) => {
            const [dayA, monthA] = a.date.split(".").map(Number);
            const [dayB, monthB] = b.date.split(".").map(Number);

            return monthA - monthB || dayA - dayB;
        });

        await interaction.reply({
            content: `List: ${
                sortedDates.length === 0
                    ? "\n" + "Empty!"
                    : "\n" + sortedDates.map((el) => `Date: ${el.date} | User: <@${el.userID}>`).join("\n")
            }`,
            ephemeral: true,
        });
    },
};

export default command;
