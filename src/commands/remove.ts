import { SlashCommandBuilder, PermissionsBitField } from "discord.js";
import { SlashCommand } from "../types";
import { birthdayRemove } from "../utils/mongo";

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
            await birthdayRemove(user.id);
            await interaction.reply({
                content: `Birthday is removed! | User: <@${user.id}>`,
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: `You can only remove your birthday!`,
                ephemeral: true,
            });
        }
    },
};

export default command;
