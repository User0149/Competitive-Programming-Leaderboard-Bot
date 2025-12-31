import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { mongoClient } from "../../database.ts";

const data = new SlashCommandBuilder()
	.setName("contests")
	.setDescription("See contests on this server");

const execute = async (interaction: ChatInputCommandInteraction) => {
	const guildId = interaction.guildId;
	const guildName = interaction.guild?.name;

	if (!guildId) {
		throw new Error("Guild ID is null.");
	}
	if (!guildName) {
		throw new Error("Guild name is null.");
	}

	const db  = mongoClient.db(guildId);
	const collections = await db.collections();
	const collectionsNames = collections.map(collection => collection.collectionName);

	await interaction.reply(`**Contests on ${guildName}**\n` + "```" + collectionsNames.join("\n") + "```");
};

export default {
	data,
	execute
};
