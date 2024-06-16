import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    data: new SlashCommandBuilder().setName("test").setDescription("Test command"),
    execute: async (interaction) => {
        await interaction.reply("test");
    },
};

export default command;
