import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { SlashCommandBuilder, PermissionsBitField, MessageFlags } from "discord.js";
import { SlashCommand } from "../types";
import { birthdayUpdate } from "../database";

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("update")
        .setDescription("Update birthday")
        .addStringOption((option) => option.setName("date").setDescription("Birthday date").setRequired(true))
        .addUserOption((option) => option.setName("user").setDescription("Select user").setRequired(true)),
    execute: async (interaction) => {
        const date = interaction.options.getString("date", true);
        const user = interaction.options.getUser("user", true);

        const isDateValid = dayjs(date, "DD.MM", true).isValid();

        if (!isDateValid) {
            return await interaction.reply({
                content: `Date is invalid!`,
                flags: MessageFlags.Ephemeral,
            });
        }

        const author = interaction.user;

        const hasPermission = interaction.memberPermissions?.has(PermissionsBitField.Flags.ModerateMembers);

        if (hasPermission || user.id === author.id) {
            const guildID = interaction.guild.id;
            const updated = await birthdayUpdate(guildID, user.id, date, author.id);
            if (!updated) {
                return await interaction.reply({
                    content: `Birthday not found for user <@${user.id}>!`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            await interaction.reply({
                content: `Birthday is updated! | Date: ${date} | User: <@${user.id}>`,
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: `You can only add your birthday!`,
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};

export default command;
