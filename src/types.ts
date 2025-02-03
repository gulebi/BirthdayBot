import { SlashCommandBuilder, CommandInteraction, ChatInputCommandInteraction } from "discord.js";

export interface SlashCommand {
    data: SlashCommandBuilder | any;
    execute: (interaction: ChatInputCommandInteraction) => void;
    aliases?: string[];
    cooldown?: number | 1000;
}

export interface Birthday {
    userID: string;
    date: string;
    ver: number;
}
