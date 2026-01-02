import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { leaderboardDb } from "../../database.ts";

import type { Contest } from "../../types/types.ts";

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

	const contestsCollection = leaderboardDb.collection<Contest>("contests");
	const contestsOnServer = contestsCollection.find({ guildId });

	let replyString = `**Contests on ${guildName}**\n\n`;
	for await (const contest of contestsOnServer) {
		replyString += "`" + contest.name + "` — `" + contest.problems + "` problems \n";
	}

	await interaction.reply(replyString);
};

export default {
	data,
	execute
};
