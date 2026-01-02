import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { leaderboardDb } from "../../database.ts";

import type { Contest, ContestantScores } from "../../types/types.ts";

const data = new SlashCommandBuilder()
	.setName("add-scores")
	.setDescription("Add your scores for a contest")
    .addStringOption((option) => option.setName("contest-name").setDescription("The name of the contest").setRequired(true))
    .addStringOption((option) => option.setName("scores").setDescription("Your scores for each problem, separated by '/' (e.g., 58/100/41)").setRequired(true))

const execute = async (interaction: ChatInputCommandInteraction) => {
	const guildId = interaction.guildId;
	const userId = interaction.user.id;

	const interactionOptions = interaction.options;
	const contestName = interactionOptions.getString("contest-name");
    const scores = interactionOptions.getString("scores")?.split("/").map(score => Number(score));

	if (!guildId) {
		throw new Error("Guild ID is null.");
	}
	if (!contestName) {
		throw new Error("Contest name is null.");
	}
    if (!scores || scores.some(score => isNaN(score))) {
        // a score is not a number
		await interaction.reply(`The format of your scores is invalid. Try again.`);
        return;
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
	const contestProblems = contestDocument.problems;

	if (scores.length !== contestProblems) {
		await interaction.reply(`Contest \`${contestName}\` has \`${contestProblems}\` problem${contestProblems > 1 ? "s" : ""}!`);
        return;
	}

	// add scores
	if (await scoresCollection.findOne({ userId, guildId, contestId }) === null) {
		// don't already have scores for this contest
		scoresCollection.insertOne({ userId, guildId, contestId, scores});
	}
	else {
		// update current scores
		scoresCollection.updateOne({ userId, guildId, contestId }, {$set: { scores }});
	}

	await interaction.reply(`Added your scores to contest \`${contestName}\`.`);
};

export default {
	data,
	execute
};
