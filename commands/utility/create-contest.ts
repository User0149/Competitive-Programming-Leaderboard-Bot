import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { leaderboardDb } from "../../database.ts";

import type { Contest } from "../../types/types.ts";

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

	const contestsCollection = leaderboardDb.collection<Contest>("contests");

	if (await contestsCollection.findOne({ name: contestName, guildId }) !== null) {
		// this contest already exists
		await interaction.reply(`A contest with the name \`${contestName}\` already exists.`);
		return;
	}

	// create a document with the contest metadata
	await contestsCollection.insertOne({
		name: contestName,
		guildId,
		problems: contestProblems
	});

	await interaction.reply(`Created contest.\nName: \`${contestName}\`\nProblems: \`${contestProblems}\`.`);
};

export default {
	data,
	execute
};
