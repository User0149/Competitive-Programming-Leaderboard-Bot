
import { Client, Collection, Events, GatewayIntentBits, MessageFlags } from "discord.js";

import config from "./config.json" with { type: "json" };
import { connectToDatabase } from "./database.ts";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

interface ClientWithCommands extends Client {
	commands: Collection<string, any>;
}

// allow bot to access leaderboard database
connectToDatabase();

const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as ClientWithCommands;

// add slash commands
client.commands = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const commandModule = await import(`file://${filePath}`);
		const command = commandModule.default ?? commandModule;
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// handle slash commands
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = (interaction.client as ClientWithCommands).commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});

// login to bot
client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});
client.login(config.token);
