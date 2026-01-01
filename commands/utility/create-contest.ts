import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { mongoClient } from "../../database.ts";
import { Contest } from "../../types/types.ts";

const data = new SlashCommandBuilder()
	.setName("create-contest")
	.setDescription("Create a new contest")
    .addStringOption((option) => option.setName("name").setDescription("The name of the contest").setRequired(true))
    .addIntegerOption((option) => option.setName("problems").setDescription("Number of problems in the contest").setMinValue(1).setRequired(true));

const execute = async (interaction: ChatInputCommandInteraction) => {
	const guildId = interaction.guildId;

	const interactionOptions = interaction.options;
	const contestName = interactionOptions.getString("name");
	const contestProblems = interactionOptions.getInteger("problems");

	if (!guildId) {
		throw new Error("Guild ID is null.");
	}
	if (!contestName) {
		throw new Error("Contest name is null.");
	}
	if (!contestProblems) {
		throw new Error("Contest problems is null.");
	}

	const db = mongoClient.db(guildId);
	if ((await db.collections()).some(collection => collection.collectionName === contestName)) {
		// this contest already exists
		await interaction.reply(`A contest with the name \`${contestName}\` already exists.`);
		return;
	}

	// create a document with the contest metadata
	await db.collection<Contest>(contestName).insertOne({
		name: contestName,
		problems: contestProblems,
		leaderboard: []
	});

	await interaction.reply(`Created contest.\nName: \`${contestName}\`\nProblems: \`${contestProblems}\`.`);
};

export default {
	data,
	execute
};
