import { SlashCommandOptionsOnlyBuilder, ChatInputCommandInteraction } from "discord.js";

export interface SlashCommand {
    data: SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction<"cached">) => Promise<any>;
    cooldown?: number;
}

export interface Birthday {
    guildID: string;
    userID: string;
    date: string;
    addedBy: string;
    addedDate: Date;
    lastUpdatedBy: string;
    lastUpdatedDate: Date;
    version: number;
}

export interface Settings {
    guildID: string;
    channelID: string;
    allowUsersManage: boolean;
    lastUpdatedBy: string;
    lastUpdatedDate: Date;
    version: number;
}
