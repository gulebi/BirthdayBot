import { ChatInputCommandInteraction } from "discord.js";

export const sendError = async (error: string, interaction: ChatInputCommandInteraction, isReply = false) => {
    if (isReply) {
        await interaction.reply({
            content: "Error",
            ephemeral: true,
        });
    } else {
        await interaction.followUp({
            content: "Error",
            ephemeral: true,
        });
    }
};
