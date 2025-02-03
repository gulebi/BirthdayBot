import { Client, Events, GatewayIntentBits } from "discord.js";
import { cmdLoader, cmdTrigger } from "./cmdHandler";
import getEnvVar from "./utils/env";
import { mongoConnect } from "./utils/mongo";
import { setup } from "./congratulator";

export const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once(Events.ClientReady, async (c) => {
    await cmdLoader();
    await mongoConnect();
    await setup();

    console.log(`${c.user.username} is up and running!`);
});

client.on(Events.InteractionCreate, (interaction) => {
    cmdTrigger(interaction);
});

client.login(getEnvVar("TOKEN"));
