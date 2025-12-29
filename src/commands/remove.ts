import { SlashCommandBuilder, PermissionsBitField, MessageFlags } from "discord.js";
import { SlashCommand } from "../types";
import { birthdayRemove } from "../database";

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Remove birthday")
        .addUserOption((option) => option.setName("user").setDescription("Select user").setRequired(true)),
    execute: async (interaction) => {
        const user = interaction.options.getUser("user", true);

        const author = interaction.user;

        const hasPermission = interaction.memberPermissions?.has(PermissionsBitField.Flags.ModerateMembers);

        if (hasPermission || user.id === author.id) {
            const guildID = interaction.guild.id;
            await birthdayRemove(guildID, user.id);
            await interaction.reply({
                content: `Birthday is removed! | User: <@${user.id}>`,
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: `You can only remove your birthday!`,
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};

export default command;
