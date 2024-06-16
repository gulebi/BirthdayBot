import { Collection, Interaction, REST, Routes } from "discord.js";
import { join } from "path";
import { readdirSync } from "fs";
import { SlashCommand } from "./types";
import { sendError } from "./utils/replyUtils";
import getEnvVar from "./utils/env";

const rest = new REST().setToken(getEnvVar("TOKEN"));

const slashCommands = new Collection<string, SlashCommand>();

async function cmdLoader() {
    try {
        const commandsPath = join(__dirname, "commands");
        const commandsArray = readdirSync(commandsPath).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

        commandsArray.forEach((file) => {
            const command: SlashCommand = require(`${commandsPath}/${file}`).default;

            if (command && "data" in command && "execute" in command) {
                slashCommands.set(command.data.name, command);
            } else {
                console.warn(`[WARNING] The command ${file} is missing a required "data" or "execute" property.`);
            }
        });

        console.log("Slash commands are loaded!");

        const slashCommandsArray = Array.from(slashCommands, ([key, value]) => value.data.toJSON());
        await rest.put(Routes.applicationCommands(getEnvVar("ID")), { body: slashCommandsArray });

        console.log("Slash commands are registered!");
    } catch (error) {
        console.error(error);
    }
}

function cmdTrigger(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = slashCommands.get(interaction.commandName);
    if (!command) return;

    try {
        command.execute(interaction);
    } catch (error) {
        console.error(error);
        sendError("commandExecError", interaction, true);
    }
}

export { slashCommands, cmdLoader, cmdTrigger };
