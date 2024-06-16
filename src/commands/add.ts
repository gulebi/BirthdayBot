import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import { SlashCommandBuilder, PermissionsBitField } from "discord.js";
import { SlashCommand } from "../types";
import { birthdayAdd } from "../utils/mongo";

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Add birthday")
        .addStringOption((option) => option.setName("date").setDescription("Birthday date").setRequired(true))
        .addUserOption((option) => option.setName("user").setDescription("Select user").setRequired(true)),
    execute: async (interaction) => {
        const date = interaction.options.getString("date", true);
        const user = interaction.options.getUser("user", true);

        const isDateValid = dayjs(date, "DD.MM", true).isValid();

        if (!isDateValid) {
            return await interaction.reply({
                content: `Date is invalid!`,
                ephemeral: true,
            });
        }

        const author = interaction.user;

        const hasPermission = interaction.memberPermissions?.has(PermissionsBitField.Flags.ModerateMembers);

        if (hasPermission || user.id === author.id) {
            const res = await birthdayAdd(user.id, date);
            await interaction.reply({
                content: `Birthday is ${res.ver === 1 ? "added" : "updated"}! | Date: ${date} | User: <@${user.id}>`,
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: `You can only add your birthday!`,
                ephemeral: true,
            });
        }
    },
};

export default command;
