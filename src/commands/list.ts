import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { birthdayList } from "../database";

const command: SlashCommand = {
    data: new SlashCommandBuilder().setName("list").setDescription("Show list of birthdays"),
    execute: async (interaction) => {
        const guildID = interaction.guild.id;
        const list = await birthdayList(guildID);

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
            flags: MessageFlags.Ephemeral,
        });
    },
};

export default command;
