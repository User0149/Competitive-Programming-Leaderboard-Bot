import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { leaderboardDb } from "../../database.ts";

import type { Contest, ContestantScores } from "../../types/types.ts";

const data = new SlashCommandBuilder()
	.setName("remove-scores")
	.setDescription("Remove your scores for a contest")
    .addStringOption((option) => option.setName("name").setDescription("The name of the contest").setRequired(true))

const execute = async (interaction: ChatInputCommandInteraction) => {
	const guildId = interaction.guildId;
	const userId = interaction.user.id;

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

	if (await scoresCollection.findOne({ userId, guildId, contestId }) === null) {
		// scores for this contest don't exist
		await interaction.reply(`You don't have scores for contest \`${contestName}\` on this server.`);
		return;
	}

	// remove scores
	await scoresCollection.deleteOne({ userId, guildId, contestId });

	await interaction.reply(`Deleted your scores for contest \`${contestName}\`.`);
};

export default {
	data,
	execute
};
