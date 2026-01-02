import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { leaderboardDb } from "../../database.ts";

import type { Contest, ContestantScores } from "../../types/types.ts";

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

	const contestsCollection = leaderboardDb.collection<Contest>("contests");
	const scoresCollection = leaderboardDb.collection<ContestantScores>("scores");

	const contestDocument = await contestsCollection.findOne({ name: contestName, guildId });

	if (contestDocument === null) {
		// contest doesn't exist
		await interaction.reply(`A contest with the the name \`${contestName}\` does not exist.`);
		return;
	}

	const contestId = contestDocument._id.toString();

	// delete the contest
    await contestsCollection.deleteOne({ name: contestName, guildId });

	// delete all scores in this guild with that belong to this contest
	await scoresCollection.deleteMany({ guildId, contestId });

	await interaction.reply(`Deleted contest \`${contestName}\`.`);
};

export default {
	data,
	execute
};
