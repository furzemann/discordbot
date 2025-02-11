const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userid')
		.setDescription('Replies with github repo'),
	async execute(interaction) {
		await interaction.reply(`testing`);
	},
};