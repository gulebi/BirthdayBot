import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    data: new SlashCommandBuilder().setName("info").setDescription("Info command"),
    execute: async (interaction) => {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Birthday Bot Info")
                    .setDescription("This bot helps you manage and remember birthdays in your server.")
                    .addFields(
                        {
                            name: "Commands",
                            value: `/add - Add a birthday\n
                            /update - Update a birthday\n
                            /remove - Remove a birthday\n
                            /list - Get list all birthdays\n
                            /channel - Set the birthday announcement channel (admin only)\n
                            /info - Show this info`,
                        },
                        { name: "Date Format", value: "Please use the format DD.MM when adding birthdays." }
                    )
                    .setColor(0x00ae86),
            ],
            flags: MessageFlags.Ephemeral,
        });
    },
};

export default command;
