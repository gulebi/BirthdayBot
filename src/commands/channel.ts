import { SlashCommandBuilder, PermissionsBitField, MessageFlags } from "discord.js";
import { SlashCommand } from "../types";
import { settingsSet } from "../database/mongo";

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("channel")
        .setDescription("Set birthday channel")
        .addChannelOption((option) =>
            option.setName("channel").setDescription("Announcements channel").setRequired(true)
        ),
    execute: async (interaction) => {
        const channel = interaction.options.getChannel("channel", true);

        const hasPermission = interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild);

        if (hasPermission) {
            const guildID = interaction.guild.id;
            const settings = await settingsSet(guildID, channel.id, interaction.user.id);
            await interaction.reply({
                content: `Birthday channel is ${settings.version === 1 ? "added" : "updated"}! | Channel: <#${
                    channel.id
                }>`,
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: `You do not have permission to do that!`,
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};

export default command;
