import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";

import { leaderboardDb } from "../../database.ts";

import type { Contest, ContestantScores } from "../../types/types.ts";

const data = new SlashCommandBuilder()
	.setName("leaderboard")
	.setDescription("See the leaderboard for a contest")
    .addStringOption((option) => option.setName("contest-name").setDescription("The name of the contest").setRequired(true))

const execute = async (interaction: ChatInputCommandInteraction) => {
	const guildId = interaction.guildId;

	const interactionOptions = interaction.options;
	const contestName = interactionOptions.getString("contest-name");

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
    const contestScores = await scoresCollection.find({ guildId, contestId }).sort({ totalScore: -1 }).toArray();

    let replyString = `Leaderboard for **${contestName}**\n`;
    for (const contestantScores of contestScores) {
        replyString += `<@${contestantScores.userId}> — ${contestantScores.totalScore} \n`;
    }

	await interaction.reply(`Leaderboard for **${contestName}**...`);
    await interaction.editReply(replyString);
};

export default {
	data,
	execute
};
