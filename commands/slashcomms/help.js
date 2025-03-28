const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Replies with github repo"),
  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    await wait(5_000);
    await interaction.editReply("https://github.com/furzemann/discordbot");
  },
};
