import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { mongoClient } from "../../database.ts";

const data = new SlashCommandBuilder()
	.setName("rename-contest")
	.setDescription("Rename a contest")
    .addStringOption((option) => option.setName("old-name").setDescription("The existing name of the contest").setRequired(true))
    .addStringOption((option) => option.setName("new-name").setDescription("The new name of the contest").setRequired(true))

const execute = async (interaction: ChatInputCommandInteraction) => {
	const guildId = interaction.guildId;

	const interactionOptions = interaction.options;
	const oldContestName = interactionOptions.getString("old-name");
	const newContestName = interactionOptions.getString("new-name");

	if (!guildId) {
		throw new Error("Guild ID is null.");
	}
	if (!oldContestName) {
		throw new Error("Old contest name is null.");
	}
	if (!newContestName) {
		throw new Error("New contest name is null.");
	}

	const db = mongoClient.db(guildId);
	if (!(await db.collections()).some(collection => collection.collectionName === oldContestName)) {
		// contest doesn't exist
		await interaction.reply(`A contest with the the name ${oldContestName} does not exist.`);
		return;
	}

	if (oldContestName === newContestName) {
		await interaction.reply(`The new contest name and old contest name are the same!`);
		return;
	}

	// update the contest name
    await db.renameCollection(oldContestName, newContestName);
    await db.collection(newContestName).updateOne({ name: { $exists: true } }, { $set: { name: newContestName } });

	await interaction.reply(`Renamed contest \`${oldContestName}\` to \`${newContestName}\`.`);
};

export default {
	data,
	execute
};
