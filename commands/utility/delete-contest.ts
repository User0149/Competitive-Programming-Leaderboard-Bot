import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { mongoClient } from "../../database.ts";

const data = new SlashCommandBuilder()
	.setName("delete-contest")
	.setDescription("Delete a contest")
    .addStringOption((option) => option.setName("name").setDescription("The name of the contest").setRequired(true))

const execute = async (interaction: ChatInputCommandInteraction) => {
	const guildId = interaction.guildId;

	const interactionOptions = interaction.options;
	const contestName = interactionOptions.getString("name");

	if (!guildId) {
		throw new Error("Guild ID is null.");
	}
	if (!contestName) {
		throw new Error("Contest name is null.");
	}

	const db = mongoClient.db(guildId);
	if (!(await db.collections()).some(collection => collection.collectionName === contestName)) {
		// contest doesn't exist
		await interaction.reply(`A contest with the the name \`${contestName}\` does not exist.`);
		return;
	}

	// delete the contest name
    await db.collection(contestName).drop();

	await interaction.reply(`Deleted contest \`${contestName}\`.`);
};

export default {
	data,
	execute
};
