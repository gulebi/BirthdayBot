import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    data: new SlashCommandBuilder().setName("info").setDescription("Info command"),
    execute: async (interaction) => {
        await interaction.reply({
            content: "Add birthday with /add command and remove with /remove. Date format is DD.MM",
            flags: MessageFlags.Ephemeral,
        });
    },
};

export default command;
