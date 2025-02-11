const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with github repo'),
	async execute(interaction) {
		await interaction.reply('https://github.com/furzemann/discordbot');
	},
};