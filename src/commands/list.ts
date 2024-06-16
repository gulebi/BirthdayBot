import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { birthdayList } from "../utils/mongo";

const command: SlashCommand = {
    data: new SlashCommandBuilder().setName("list").setDescription("Show list of birthdays"),
    execute: async (interaction) => {
        const list = await birthdayList();

        await interaction.reply({
            content: `List: ${
                list.length === 0 ? `\nEmpty!` : list.map((el) => `\nDate: ${el.date} | User: <@${el.userID}>`)
            }`,
            ephemeral: true,
        });
    },
};

export default command;
